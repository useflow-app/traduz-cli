import {Command, CliUx} from '@oclif/core';
import {ConfigField, Config} from '../config';
import {djangoConfig} from '../stacks/django';
import {reactConfig} from '../stacks/react';
import {iosConfig} from '../stacks/ios';
import {androidConfig} from '../stacks/android';
import {jsConfig} from '../stacks/js';
import {flutterConfig} from '../stacks/flutter';

export default class Setup extends Command {
    static description = 'setup i18n cli';

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ];

    public async run(): Promise<void> {
        const config = new Config();
        const inquirer = require('inquirer');
        const stacks = ['django', 'react', 'ios', 'android', 'js', 'flutter'];
        const stackConfig: any = {
            django: djangoConfig,
            react: reactConfig,
            ios: iosConfig,
            android: androidConfig,
            js: jsConfig,
            flutter: flutterConfig,
        };
        const selectedStack = config.get(ConfigField.stack, '');
        stacks.sort((x,y) => {
            return x == selectedStack ? -1 : y == selectedStack ? 1 : 0;
        });

        const questions = [
            {
                name: 'stack',
                message: 'Select a stack',
                type: 'list',
                choices: stacks,
            },
            {
                type: 'input',
                name: 'host',
                message: 'I18n Host',
                default: config.get(ConfigField.host, 'https://ms.i18n.useflow.tech/'),
                validate: config.validateHost
            },
            {
                type: 'input',
                name: 'app_id',
                message: 'Application ID',
                default: config.get(ConfigField.app_id, null),
                validate: config.validateRequired
            },
            {
                type: 'input',
                name: 'app_key',
                message: 'Application Key',
                default: config.get(ConfigField.app_key, null),
                validate: config.validateRequired
            },
        ];

        CliUx.ux.log("Let's setup this tool...");
        const responses = await inquirer.prompt(questions);
        config.set(ConfigField.stack, responses.stack);
        config.set(ConfigField.host, responses.host);
        config.set(ConfigField.app_id, responses.app_id);
        config.set(ConfigField.app_key, responses.app_key);

        const configFunc = stackConfig[responses.stack];
        if (configFunc) {
            await configFunc(config);
        }
    }
}
