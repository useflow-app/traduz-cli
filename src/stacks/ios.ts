import {CliUx} from '@oclif/core';
import {ConfigField, Config} from '../config';
import * as fs from 'fs';
import { AxiosResponse } from 'axios'
import * as stream from 'stream';
import { promisify } from 'util';


type LangResponse = {
    name: string,
    code: string
};

interface Dictionary<T> {
    [Key: string]: T;
}

export async function iosConfig(config: Config) {
    const inquirer = require('inquirer');

    const questions = [
        {
            type: 'input',
            name: 'trans_path',
            message: 'Translation path',
            default: config.get(ConfigField.trans_path, 'Runner/Resources'),
            validate: config.validateRequired
        },
        {
            type: 'input',
            name: 'trans_filename',
            message: 'Translation filename (without extension)',
            default: config.get(ConfigField.trans_filename, 'Localizable'),
            validate: config.validateRequired
        }
    ];

    const reactResponses = await inquirer.prompt(questions);
    config.set(ConfigField.trans_path, reactResponses.trans_path);
    config.set(ConfigField.trans_filename, reactResponses.trans_filename);
    if (!config.has(ConfigField.strings)) config.set(ConfigField.strings, {});
}

export default class ReactUpdate {

    private parserStep(config: Config, force: boolean): Dictionary<string> {
        const i18nStringsFiles = require('i18n-strings-files');

        const path = `${config.get(ConfigField.trans_path)}`+
            `/Base.lproj/${config.get(ConfigField.trans_filename)}.strings`;
        CliUx.ux.action.start(`parsing file ${path}`);

        const newStrings: Dictionary<string> = {};
        let strings: Dictionary<string> = config.get(ConfigField.strings, {});
        const data = i18nStringsFiles.readFileSync(path, 'UTF-8');
        if (data) {
            for (let key of Object.keys(data)) {
                if (!Object.keys(strings).includes(key)) {
                    strings[key] = data[key];
                    newStrings[key] = data[key];
                } else if (force && !Object.keys(newStrings).includes(key)) {
                    newStrings[key] = data[key];
                }
            }
            config.set(ConfigField.strings, strings);
        }

        CliUx.ux.action.stop();
        return newStrings;
    }

    private prepareDataToSend(stringsToSend: Dictionary<string>): Array<Object> {
        const data = [];
        const keys: any = [];
        for (let key of Object.keys(stringsToSend)) {
            if (!keys.includes(key)) {
                data.push({
                    text: key,
                    value: stringsToSend[key]
                });
                keys.push(key);
            }
        }
        return data;
    }

    private async sendStep(config: Config, stringsToSend: Dictionary<string>, force: boolean) {
        const axios = require('axios');

        CliUx.ux.action.start('sending new strings');
        await axios.post(
            config.get(ConfigField.host) + '/api/v1/ios/texts/',
            this.prepareDataToSend(stringsToSend),
            {
                auth: {
                    username: config.get(ConfigField.app_id),
                    password: config.get(ConfigField.app_key)
                },
            },
        ).then(async (response: any) => {
            let strings = config.get(ConfigField.strings, {});
            strings = Object.assign(strings, stringsToSend);
            config.set(ConfigField.strings, force ? stringsToSend : strings);
            CliUx.ux.action.stop();
        }).catch(function (error: any) {
            CliUx.ux.error(error);
        });
    }

    private async retrieveLangStep(config: Config, lang: LangResponse) {
        const axios = require('axios');
        const chalk = require('chalk');
        let langCode = lang.code;

        langCode = langCode.replace('_', '-');
        const langParts = langCode.split('-');
        if (langParts.length === 2) {
            langCode = `${langParts[0].toLowerCase()}-${langParts[1].toUpperCase()}`;
        }

        const dir = `${config.get(ConfigField.trans_path)}/${lang.code}.lproj`;
        const filename = config.get(ConfigField.trans_filename);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, {recursive: true});
        }

        const fsstream = fs.createWriteStream(`${dir}/${filename}.strings`);
        const finished = promisify(stream.finished);

        CliUx.ux.action.start(`retrieving language ${chalk.bold(lang.code)}`)
        await axios.get(
            config.get(ConfigField.host) + `/api/v1/ios/langs/${lang.code}/`, {
                auth: {
                    username: config.get(ConfigField.app_id),
                    password: config.get(ConfigField.app_key)
                },
                responseType: 'stream',
            },
        ).then(function (response: any) {
            response.data.pipe(fsstream);
            finished(fsstream);
        }).catch(function (error: any) {
            CliUx.ux.error(error);
        });

        await finished(fsstream);
        CliUx.ux.action.stop();
    }

    private async retrieveLangsStep(config: Config, reset: boolean): Promise<[LangResponse] | null> {
        const axios = require('axios');
        let langs = null;

        CliUx.ux.action.start('retrieving languages available');
        if (reset) {
            const dir = config.get(ConfigField.trans_path);
            fs.rmSync(dir, {recursive: true, force: true});
        }
        await axios.get(
            config.get(ConfigField.host) + '/api/v1/ios/langs/', {
                auth: {
                    username: config.get(ConfigField.app_id),
                    password: config.get(ConfigField.app_key)
                },
            },
        ).then(async (response: AxiosResponse<[LangResponse]>) => {
            CliUx.ux.action.stop();
            langs = response.data;
        }).catch(function (error: any) {
            CliUx.ux.error(error);
        });

        return langs;
    }

    public async update(config: Config, flags: any) {
        const newStrings = this.parserStep(config, flags.force);
        if (Object.keys(newStrings).length > 0) {
            await this.sendStep(config, newStrings, flags.force);
        }
        const langs = await this.retrieveLangsStep(config, flags.reset);
        if (langs !== null) {
            for (let lang of langs) {
                await this.retrieveLangStep(config, lang);
            }
        }
    }
}
