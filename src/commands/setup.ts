import {Command, CliUx} from '@oclif/core';
import {ConfigField, Config} from '../config';

export default class Setup extends Command {
    static description = 'setup i18n cli';

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ];

    private async promptField(title: string, defaultValue: string, config: Config, field: ConfigField) {
        let value: string = '';
        do {
            value = await CliUx.ux.prompt(title, {default: defaultValue});
        } while (!config.set(field, value));
    }

    public async run(): Promise<void> {
        const config = new Config();

        CliUx.ux.log("Let's setup this tool...");
        await this.promptField('I18n Host', config.get(ConfigField.host, ''), config, ConfigField.host);
        await this.promptField('Application ID', config.get(ConfigField.app_id, ''), config, ConfigField.app_id);
        await this.promptField('Application Key', config.get(ConfigField.app_key, ''), config, ConfigField.app_key);
        await this.promptField('Translation path', config.get(ConfigField.trans_path, ''), config, ConfigField.trans_path);
        await this.promptField('Translation filename', config.get(ConfigField.trans_filename, ''), config, ConfigField.trans_filename);
        if (!config.has(ConfigField.strings)) config.set(ConfigField.strings, []);
    }
}
