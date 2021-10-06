export interface Options {
    markStart?: string;
    markEnd?: string;
    getValue?: (dataSource: any, dataPath: string) => any;
    locales?: string;
    formatNumber?: (value: any, digits?: number) => string;
    formatDate?: (value: any, format?: string) => string;
}
export declare const defaultOptions: Options;
