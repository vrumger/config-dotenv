import { ConfigOptions } from './types';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import parse from './parse';

const hasProperty = (property: string): boolean => {
    return Object.prototype.hasOwnProperty.call(process.env, property);
};

const setProperty = (key: string, value: string): void => {
    process.env[key] = value;
};

const config = (options?: ConfigOptions) => {
    const envPath = options?.path ?? resolve(process.cwd(), '.env');
    const envContents = readFileSync(envPath, options?.encoding ?? 'utf8');

    const env = parse(envContents, options?.parseOptions);
    Object.entries(env).forEach(([key, value]) => {
        if (hasProperty(key)) {
            if (options?.override !== false) {
                setProperty(key, value);
            } else {
                throw new Error(`Environment variable ${key} already exists`);
            }
        } else {
            setProperty(key, value);
        }
    });

    return env;
};

export default config;
