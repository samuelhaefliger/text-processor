export interface TextProcessorOptions {
    markStart?: string;
    markEnd?: string;
    getValue?: (dataSource: any, dataPath: string) => any;
    locales?: string;
    formatNumber?: (value: any, digits?: number) => string;
    formatDate?: (value: any, format?: string) => string;
}
export declare const numberFormat: (locales: string) => (value: any, digits?: number) => string;
export declare const dateFormat: (locales: string) => (value: any) => string;
export declare const defaultOptions: TextProcessorOptions;
export declare const textProcessor: (options?: TextProcessorOptions) => (text: string, dataSource: any, keepMarks?: boolean) => string;
