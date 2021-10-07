export interface MatchOptions {
    dataPaths: string[];
    defaultValue?: string;
    addition?: string;
    type?: string;
    format?: string;
}
export declare const parseOptions: (value: string) => MatchOptions;
