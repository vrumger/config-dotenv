export interface ParseOptions {
    allowStartSpacing?: boolean;
    allowExportPrefix?: boolean;
    allowSeparatorSpacing?: boolean;
    allowQuotes?: boolean;
    allowInlineComments?: boolean;
    allowVariables?: boolean;
    trimValues?: boolean;
}

export interface ConfigOptions {
    path?: string;
    encoding?: BufferEncoding;
    override?: boolean;
    parseOptions?: ParseOptions;
}
