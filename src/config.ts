import Conf  from 'conf';

export enum ConfigField {
    stack = 'stack',
    host = 'host',
    app_id = 'app_id',
    app_key = 'app_key',
    trans_path = 'trans_path',
    strings = 'strings',
    trans_filename = 'trans_filename'
};

export class Config {

    private static configuration: Conf = new Conf({cwd: './', configName: 'traduz-config'});

    public isValid(): boolean {
        let is_valid = true;
        for (let field of Object.keys(ConfigField)) {
            is_valid = is_valid && Config.configuration.has(field);
        }
        return is_valid;
    }

    public validateHost(value: string): string | boolean {
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
        if (!host) {
            return 'Please enter a valid URL';
        }
        return true;
    }

    private clearHost(value: string): string | null {
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

    public validateRequired(value: string): string | boolean {
        if (!value) {
            return 'Please enter a value';
        }
        return true;
    }

    public clearTransPath(value: string): string | null {
        let path = value;
        if (path[path.length-1] == '/') {
            path = path.substring(0, path.length - 1);
        }
        return path;
    }

    private clearField(field: ConfigField, value: string): string | null {
        const clear: { [K: string]: Function } = {
            host: this.clearHost,
            trans_path: this.clearTransPath
        };

        if (clear[field.toString()]) {
            return clear[field.toString()](value);
        }
        return value;
    }

    public set(field: ConfigField, value: any): boolean {
        value = this.clearField(field, value);
        if (value != null) {
            Config.configuration.set(field.toString(), value);
        }
        return value != null;
    }

    public get(field: ConfigField, defaultValue: any = null): any {
        const value = Config.configuration.get(field.toString(), defaultValue);
        return value != '' ? value : null;
    }

    public has(field: ConfigField): boolean {
        return Config.configuration.has(field.toString());
    }

}
