import {Command, Flags, CliUx} from '@oclif/core';
import {Config, ConfigField} from '../config';
import ReactUpdate from '../stacks/react';
import DjangoUpdate from '../stacks/django';


export default class Update extends Command {
    static description = 'update supported languages';

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ];

    static flags = {
        force: Flags.boolean({char: 'f', description: 'force send all strings'}),
        reset: Flags.boolean({char: 'r', description: 'reset local translations'}),
    };

    public async run(): Promise<void> {
        const {flags} = await this.parse(Update);
        const config = new Config();

        if (config.isValid()) {
            const stack = config.get(ConfigField.stack);
            if (stack == 'react') {
                await new ReactUpdate().update(config, flags)
            } else if (stack == 'django') {
                await new DjangoUpdate().update(config, flags)
            }
        } else {
            CliUx.ux.log('                //_____ __');
            CliUx.ux.log('                @ )====// .\\___');
            CliUx.ux.log('                \\#\\_\\__(_/_\\\\_/');
            CliUx.ux.log('                  / /       \\\\');
            CliUx.ux.error('Hold on, little grasshopper!\n  You need setup this tool before');
        }
    }
}
