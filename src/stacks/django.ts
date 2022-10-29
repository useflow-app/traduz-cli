import {CliUx} from '@oclif/core';
import {ConfigField, Config} from '../config';
import * as fs from 'fs';
import * as readline from 'readline';
import * as events from 'events';
import * as glob from 'glob';
import { AxiosResponse } from 'axios'
import * as stream from 'stream';
import { promisify } from 'util';


type LangResponse = {
    name: string,
    code: string
};

export default class DjangoUpdate {

    private checkIfCommandExists() {
        const { execSync } = require('node:child_process');
        CliUx.ux.action.start('checking django-admin');
        let path = null;
        try {
            path = execSync('which django-admin 2> /dev/null');
        } catch(exc) {
            CliUx.ux.error('No django-admin found in your path.');
        }
        CliUx.ux.action.stop();
        if (path) {
            CliUx.ux.warn('using django-admin from: ' + path.toString().replace(/^\s+|\s+$/g, ''));
        }
    }

    private clearMsgId(msgid: string|null): string|null {
        if (msgid) {
            const lines = msgid.split('\n');
            let newLines = Array<string>();
            for (let line of lines) {
                const value = line.slice(1, -1).replace(/\\"/g, '"');
                if (value !== '') {
                    newLines.push(value);
                }
            }
            return newLines.join('\n');
        } else {
            return null;
        }
    }

    private async appParserStep(appName: string, filePath: string, config: Config, force: boolean): Promise<Object> {
        const chalk = require('chalk');

        CliUx.ux.action.start(`parsing messages from app ${chalk.bold(appName)}`);
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath, 'utf-8'),
            crlfDelay: Infinity
        });

        let msgid: string|null = null;
        let msgidPlural: string|null = null;
        let strings: any = config.get(ConfigField.strings, {});
        const translation: any = {};
        const newStrings: any = {};

        if (!Object.keys(strings).includes(appName)) {
            strings[appName] = {};
        }

        rl.on('line', (line) => {
            if (line.startsWith('msgid "')) {
                msgid = line.replace('msgid ', '')
            } else if (line.startsWith('msgid_plural "')) {
                msgidPlural = line.replace('msgid_plural ', '')
            } else if (line.startsWith('msgstr')) {
                const key = this.clearMsgId(msgid);
                const keyPlural = this.clearMsgId(msgidPlural);
                msgid = msgidPlural = null;

                if (key) {
                    translation[key] = {'plural': keyPlural};
                }
            } else if (msgid) {
                if (msgidPlural == null) {
                    msgid = `${msgid}\n${line}`;
                } else {
                    msgidPlural = `${msgidPlural}\n${line}`;
                }
            }
        });
        await events.once(rl, 'close');
        Object.keys(translation).forEach((element: any) => {
            if (!Object.keys(strings[appName]).includes(element)) {
                strings[appName][element] = translation[element];
                newStrings[element] = translation[element];
            } else if (force && !Object.keys(newStrings).includes(element)) {
                newStrings[element] = translation[element];
            }
        });

        CliUx.ux.action.stop();
        return newStrings;
    }

    private async parserStep(config: Config, force: boolean): Promise<Object> {
        const { execSync } = require('node:child_process');
        const newStrings: any = {};

        this.checkIfCommandExists();
        CliUx.ux.action.start('generating messages');
        execSync('django-admin makemessages -l traduz > /dev/null 2>&1');
        CliUx.ux.action.stop();

        CliUx.ux.action.start('searching for apps');
        const files: Array<string> = glob.sync('*/locale/traduz/LC_MESSAGES/django.po');
        const apps = Array<string>();
        for (let element of files) {
            const appName: string = element.split('/')[0];
            apps.push(appName);
            newStrings[appName] = await this.appParserStep(appName, element, config, force);
        }
        CliUx.ux.action.stop();

        CliUx.ux.action.start('cleaning generated messages');
        apps.forEach((element: any) => {
            fs.rmSync(`${element}/locale/traduz/`, { recursive: true, force: true });
        });
        CliUx.ux.action.stop();

        return newStrings;
    }

    private prepareDataToSend(stringsToSend: any): Array<Object> {
        const data: Array<Object> = [];
        Object.keys(stringsToSend).forEach((app: any) => {
            Object.keys(stringsToSend[app]).forEach((key: any) => {
                const plural = stringsToSend[app][key]['plural'];
                data.push({
                    text: key,
                    text_plural: plural,
                    plural: plural != null,
                    module: app
                });
            });
        });

        return data;
    }

    private mergeRecursive(obj1: any, obj2: any): Object {
        for (let p in obj2) {
          try {
            if (obj2[p].constructor == Object) {
              obj1[p] = this.mergeRecursive(obj1[p], obj2[p]);
            } else {
              obj1[p] = obj2[p];
            }
          } catch(e) {
            obj1[p] = obj2[p];
          }
        }

        return obj1;
      }

    private async sendStep(config: Config, stringsToSend: Object, force: boolean) {
        const axios = require('axios');
        const toSend = this.prepareDataToSend(stringsToSend);

        if (toSend.length > 0) {
            CliUx.ux.action.start('sending new strings');
            await axios.post(
                config.get(ConfigField.host) + '/api/v1/django/texts/',
                toSend,
                {
                    auth: {
                        username: config.get(ConfigField.app_id),
                        password: config.get(ConfigField.app_key)
                    },
                },
            ).then(async (response: any) => {
                const strings = config.get(ConfigField.strings, {});
                config.set(ConfigField.strings, force ? stringsToSend : this.mergeRecursive(strings, stringsToSend));
                CliUx.ux.action.stop();
            }).catch(function (error: any) {
                CliUx.ux.error(error);
            });
        }
    }

    private async retrieveLangStep(config: Config, lang: LangResponse, app: string) {
        const axios = require('axios');
        const chalk = require('chalk');

        let code = lang.code;
        if (code.includes('-')) {
            const parts = code.split('-');
            if (parts.length == 2) {
                code = `${parts[0]}_${parts[0].toUpperCase()}`
            }
        }

        const dir = `${app}/locale/${code}/LC_MESSAGES`;
        const filename = 'django'

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, {recursive: true});
        }

        const fsstream = fs.createWriteStream(`${dir}/${filename}.po`);
        const finished = promisify(stream.finished);

        CliUx.ux.action.start(`retrieving language ${chalk.bold(lang.code)} for app ${chalk.bold(app)}`)
        await axios.get(
            config.get(ConfigField.host) + `/api/v1/django/${app}/langs/${lang.code}/`, {
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
            config.get(ConfigField.host) + '/api/v1/django/langs/', {
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

    private async compileStep() {
        const { execSync } = require('node:child_process');

        CliUx.ux.action.start('compiling messages');
        execSync('django-admin compilemessages > /dev/null 2>&1');
        CliUx.ux.action.stop();
    }

    public async update(config: Config, flags: any) {
        const newStrings = await this.parserStep(config, flags.force);
        await this.sendStep(config, newStrings, flags.force);
        const langs = await this.retrieveLangsStep(config, flags.reset);
        if (langs != null) {
            const apps = config.get(ConfigField.strings, {});
            for (let lang of langs) {
                for (let app of Object.keys(apps)) {
                    await this.retrieveLangStep(config, lang, app);
                }
            }
            await this.compileStep();
        }
    }
}
