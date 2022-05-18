import { ParseOptions } from './types';

const defaultOptions: ParseOptions = {
    allowStartSpacing: false,
    allowExportPrefix: false,
    allowSeparatorSpacing: false,
    allowQuotes: false,
    allowInlineComments: false,
    trimValues: false,
};

const parse = (contents: string, options?: ParseOptions) => {
    const _options = {
        ...defaultOptions,
        ...options,
    };

    const exportPrefix = _options?.allowExportPrefix ? '(?:export\\s+)?' : '';
    const startSpacing = _options?.allowStartSpacing ? '\\s*?' : '';
    const separator = _options?.allowSeparatorSpacing ? '\\s*?=\\s*' : '=';
    const inlineComments = _options?.allowInlineComments ? '(?:#.*)?' : '';
    const value = _options?.allowQuotes
        ? `(?:"([^"]*?)"${inlineComments}|'([^']*?)'${inlineComments}|(.+?)${inlineComments})`
        : `(.+?)${inlineComments}`;

    const regex = new RegExp(
        `^${startSpacing}${exportPrefix}([a-z0-9_-]+)${separator}${value}$`,
        'gim',
    );

    const env = new Map(
        [...contents.replace(/\r\n?/g, '\n').matchAll(regex)].map(
            ([, key, ...values]) => {
                let value = values.find(Boolean)!;
                if (_options.trimValues) {
                    value = value.trim();
                }
                return [key, value];
            },
        ),
    );

    if (_options?.allowVariables) {
        env.forEach((value, key) => {
            const replacedValue = value.replace(
                /(?<!\\)((?:\\\\)*)\$\{([a-z0-9_-]+)\}/gi,
                (match, _, variable) => env.get(variable) ?? match,
            );

            if (replacedValue !== value) {
                env.set(key, replacedValue);
            }
        });
    }

    return Object.fromEntries([...env.entries()]);
};

export default parse;
