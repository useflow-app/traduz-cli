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

export async function androidConfig(config: Config) {
    const inquirer = require('inquirer');

    const questions = [
        {
            type: 'input',
            name: 'trans_path',
            message: 'Translation path',
            default: config.get(ConfigField.trans_path, 'app/src/main/res'),
            validate: config.validateRequired
        },
        {
            type: 'input',
            name: 'trans_filename',
            message: 'Translation filename (without extension)',
            default: config.get(ConfigField.trans_filename, 'strings'),
            validate: config.validateRequired
        }
    ];

    const reactResponses = await inquirer.prompt(questions);
    config.set(ConfigField.trans_path, reactResponses.trans_path);
    config.set(ConfigField.trans_filename, reactResponses.trans_filename);
    if (!config.has(ConfigField.strings)) config.set(ConfigField.strings, {});
}

export default class AndroidUpdate {

    private parseString(element: any): any {
        let objs = [];
        if (element.attributes.translatable !== 'false') {
            if (element.elements.length === 1) {
                const key = element.attributes.name;
                if (element.elements[0].type === 'text') {
                    const value = element.elements[0].text.replace('\n','');
                    objs.push({key: key, value: {value: value, array: null}});
                } else if (element.elements[0].type === 'cdata') {
                    const value = `<![CDATA[${element.elements[0].cdata.replace('\n','')}]]>`;
                    objs.push({key: key, value: {value: value, array: null}});
                }
            }
        }
        return objs;
    }

    private parseStringArray(element: any): any {
        let objs = [];
        if (element.attributes.translatable !== 'false') {
            let idx = 1;
            for (let item of element.elements) {
                if (item.type === 'element' && item.name === 'item') {
                    if (!item.attributes || item.attributes.translatable !== 'false') {
                        if (item.elements.length === 1) {
                            const array = element.attributes.name;
                            const key = `${array} #array#${idx}`;
                            if (item.elements[0].type === 'text') {
                                const value = item.elements[0].text.replace('\n','');
                                objs.push({key: key, value: {value: value, array: array}});
                            } else if (item.elements[0].type === 'cdata') {
                                const value = `<![CDATA[${item.elements[0].cdata.replace('\n','')}]]>`;
                                objs.push({key: key, value: {value: value, array: array}});
                            }
                        }
                    }
                    idx++;
                }
            }
        }
        return objs;
    }

    private parserStep(config: Config, force: boolean): Dictionary<Dictionary<string>> {
        const parser = require('xml-js');

        const path = `${config.get(ConfigField.trans_path)}`+
            `/values/${config.get(ConfigField.trans_filename)}.xml`;
        CliUx.ux.action.start(`parsing file ${path}`);
        const xml = fs.readFileSync(path, 'utf8');
        let xmlLines: Array<string> = [];
        for (let line of xml.split('\n')) {
            xmlLines.push(line.trim());
        }
        const newStrings: Dictionary<Dictionary<string>> = {};
        const json = parser.xml2js(xmlLines.join('\n'));
        if (json) {
            const resources = json.elements[0];
            if (resources.name === 'resources') {
                let strings: Dictionary<Dictionary<string>> = config.get(ConfigField.strings, {});
                const elements = resources.elements;
                for (let element of elements) {
                    if (element.type === 'element') {
                        let objs = [];
                        if (element.name === 'string') {
                            objs = this.parseString(element);
                        } else if (element.name === 'string-array') {
                            objs = this.parseStringArray(element);
                        }
                        if (objs.length > 0) {
                            for (let obj of objs) {
                                if (!Object.keys(strings).includes(obj.key)) {
                                    strings[obj.key] = obj.value;
                                    newStrings[obj.key] = obj.value;
                                } else if (force && !Object.keys(newStrings).includes(obj.key)) {
                                    newStrings[obj.key] = obj.value;
                                }
                            }
                        }
                    }
                }
                config.set(ConfigField.strings, strings);
            }
        }

        CliUx.ux.action.stop();
        return newStrings;
    }

    private prepareDataToSend(stringsToSend: Dictionary<Dictionary<string>>): Array<Object> {
        const data = [];
        const keys: any = [];
        for (let key of Object.keys(stringsToSend)) {
            if (!keys.includes(key)) {
                data.push({
                    text: key,
                    value: stringsToSend[key]['value'],
                    array: stringsToSend[key]['array'],
                });
                keys.push(key);
            }
        }
        return data;
    }

    private async sendStep(config: Config, stringsToSend: Dictionary<Dictionary<string>>, force: boolean) {
        const axios = require('axios');

        CliUx.ux.action.start('sending new strings');
        await axios.post(
            config.get(ConfigField.host) + '/api/v1/android/texts/',
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
            langCode = `${langParts[0].toLowerCase()}-r${langParts[1].toUpperCase()}`;
        }

        const dir = `${config.get(ConfigField.trans_path)}/values-${lang.code}`;
        const filename = config.get(ConfigField.trans_filename);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, {recursive: true});
        }

        const fsstream = fs.createWriteStream(`${dir}/${filename}.xml`);
        const finished = promisify(stream.finished);

        CliUx.ux.action.start(`retrieving language ${chalk.bold(lang.code)}`)
        await axios.get(
            config.get(ConfigField.host) + `/api/v1/android/langs/${lang.code}/`, {
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
            config.get(ConfigField.host) + '/api/v1/android/langs/', {
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
