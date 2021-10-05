export interface Options {
    markStart: string;
    markEnd: string;
    getValue?: (dataSource: any, dataPath: string) => any;
    locales?: string;
    formatNumber?: (value: any, digits?: number) => string;
    formatDate?: (value: any, format?: string) => string;
}
export declare const numberFormat: (locales: string) => (value: any, digits?: number) => string;
export declare const dateFormat: (locales: string) => (value: any) => string;
export declare const textProcessor: ({ markStart, markEnd, getValue, formatNumber, formatDate }?: Options) => (text: string, dataSource: any, keepMarks?: boolean) => string;
export default textProcessor;
