import {CliUx} from '@oclif/core';
import {ConfigField, Config} from '../config';
import * as fs from 'fs';
import * as glob from 'glob';
import { AxiosResponse } from 'axios'
import * as stream from 'stream';
import { promisify } from 'util';


type LangResponse = {
    name: string,
    code: string
};

export default class ReactUpdate {

    private parserStep(config: Config, force: boolean): Array<string> {
        const Parser = require('i18next-scanner').Parser;

        CliUx.ux.action.start('parsing files *.js, *.jsx and *.tsx');
        const files: Array<string> = glob.sync('src/**/*.{js,jsx,tsx}');
        const parser = new Parser();

        const newStrings: Array<string> = [];
        let strings: any = config.get(ConfigField.strings, []);
        files.forEach((element: string) => {
            let content = fs.readFileSync(element, 'utf-8');
            parser
                .parseFuncFromString(content, {list: ['i18next.t', 'i18n.t', 't']})
                .parseFuncFromString(content, {component: 'Trans', i18nKey: 'i18nKey'});
        });
        const translation = parser.get().en.translation;
        Object.keys(translation).forEach((element: any) => {
            const t = typeof translation[element];
            if (t === 'string' || (t === 'object' && element.constructor.name === 'String')) {
                if (!strings.includes(element)) {
                    strings.push(element);
                    newStrings.push(element);
                } else if (force && !newStrings.includes(element)) {
                    newStrings.push(element);
                }
            }
        });

        CliUx.ux.action.stop();
        return newStrings;
    }

    private prepareDataToSend(stringsToSend: Array<string>): Array<Object> {
        const data = [];
        const keys: any = [];
        for (let str of stringsToSend) {
            const key = str.replace('_plural', '');
            const plural = str.endsWith('_plural')
            if (!keys.includes(key)) {
                data.push({
                    text: key,
                    plural: plural,
                });
                keys.push(key);
            } else if (plural) {
                for (let el of data) {
                    if (el.text === key) {
                        el.plural = plural;
                        break;
                    }
                }
            }
        }
        return data;
    }

    private async sendStep(config: Config, stringsToSend: Array<string>, force: boolean) {
        const axios = require('axios');

        CliUx.ux.action.start('sending new strings');
        await axios.post(
            config.get(ConfigField.host) + '/api/v1/react/texts/',
            this.prepareDataToSend(stringsToSend),
            {
                auth: {
                    username: config.get(ConfigField.app_id),
                    password: config.get(ConfigField.app_key)
                },
            },
        ).then(async (response: any) => {
            const strings = config.get(ConfigField.strings, []);
            strings.push(...stringsToSend);
            config.set(ConfigField.strings, force ? stringsToSend : strings);
            CliUx.ux.action.stop();
        }).catch(function (error: any) {
            CliUx.ux.error(error);
        });
    }

    private async retrieveLangStep(config: Config, lang: LangResponse) {
        const axios = require('axios');
        const chalk = require('chalk');

        const dir = `${config.get(ConfigField.trans_path)}/${lang.code}`;
        const filename = config.get(ConfigField.trans_filename);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, {recursive: true});
        }

        const fsstream = fs.createWriteStream(`${dir}/${filename}.json`);
        const finished = promisify(stream.finished);

        CliUx.ux.action.start(`retrieving language ${chalk.bold(lang.code)}`)
        await axios.get(
            config.get(ConfigField.host) + `/api/v1/react/langs/${lang.code}/`, {
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
            config.get(ConfigField.host) + '/api/v1/react/langs/', {
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
        if (newStrings.length > 0) {
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
