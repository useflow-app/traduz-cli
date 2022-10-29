import {Command, CliUx} from '@oclif/core';
import {ConfigField, Config} from '../config';

export default class Setup extends Command {
    static description = 'setup i18n cli';

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ];

    public async run(): Promise<void> {
        const config = new Config();
        const inquirer = require('inquirer');

        const questions = [
            {
                name: 'stack',
                message: 'Select a stack',
                type: 'list',
                choices: config.get(ConfigField.stack, '') == 'react' ? ['react', 'django'] : ['django', 'react'],
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

        const reactQuestions = [
            {
                type: 'input',
                name: 'trans_path',
                message: 'Translation path',
                default: config.get(ConfigField.trans_path, null),
                validate: config.validateRequired
            },
            {
                type: 'input',
                name: 'trans_filename',
                message: 'Translation filename',
                default: config.get(ConfigField.trans_filename, null),
                validate: config.validateRequired
            }
        ];

        CliUx.ux.log("Let's setup this tool...");
        const responses = await inquirer.prompt(questions);
        config.set(ConfigField.stack, responses.stack);
        config.set(ConfigField.host, responses.host);
        config.set(ConfigField.app_id, responses.app_id);
        config.set(ConfigField.app_key, responses.app_key);
        if (responses.stack == 'react') {
            const reactResponses = await inquirer.prompt(reactQuestions);
            config.set(ConfigField.trans_path, reactResponses.trans_path);
            config.set(ConfigField.trans_filename, reactResponses.trans_filename);
            if (!config.has(ConfigField.strings)) config.set(ConfigField.strings, []);
        } else {
            config.set(ConfigField.trans_path, '')
            config.set(ConfigField.trans_filename, '');
            if (!config.has(ConfigField.strings)) config.set(ConfigField.strings, {});
        }
    }
}
