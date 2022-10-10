import Conf  from 'conf';
import * as fs from 'fs';

export enum ConfigField {
    host = 'host',
    app_id = 'app_id',
    app_key = 'app_key',
    trans_path = 'trans_path',
    strings = 'strings',
    trans_filename = 'trans_filename'
};

export class Config {

    private static configuration: Conf = new Conf({cwd: './', configName: 'react-i18n-config'});

    public isValid(): boolean {
        let is_valid = true;
        for (let field of Object.keys(ConfigField)) {
            is_valid = is_valid && Config.configuration.has(field);
        }
        return is_valid;
    }

    private validate_host(value: string): string | null {
        let host = null
        try {
            new URL(value);
            host = value;
            if (host[host.length-1] == '/') {
                host = host.substring(0, host.length - 1);
            }
        } catch {
            // None
        }
        return host;
    }

    private validate_trans_path(value: string): string | null {
        let path = value;
        if (path[path.length-1] == '/') {
            path = path.substring(0, path.length - 1);
        }
        return path;
    }

    private validate(field: ConfigField, value: string): string | null {
        const validate: { [K: string]: Function } = {
            host: this.validate_host,
            trans_path: this.validate_trans_path
        };

        if (validate[field.toString()]) {
            return validate[field.toString()](value);
        }
        return value;
    }

    public set(field: ConfigField, value: any): boolean {
        value = this.validate(field, value);
        if (value != null) {
            Config.configuration.set(field.toString(), value);
        }
        return value != null;
    }

    public get(field: ConfigField, defaultValue: any = null): any {
        return Config.configuration.get(field.toString(), defaultValue);
    }

    public has(field: ConfigField): boolean {
        return Config.configuration.has(field.toString());
    }

}
