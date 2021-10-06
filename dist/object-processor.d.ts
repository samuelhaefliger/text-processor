import { TextProcessorOptions } from './text-processor';
export declare type ProcessorRegistry = {
    [key: string]: (element: any, dataSource: any) => any;
};
export interface ObjectProcessorOptions extends TextProcessorOptions {
    clone: <T>(value: T, customizer: (value: any, key: string) => any) => T;
    processors?: ProcessorRegistry;
}
export declare const objectProcessor: (options: ObjectProcessorOptions) => <T = any>(value: T, dataSource?: any) => T;
