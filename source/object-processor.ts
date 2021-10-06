import { defaultOptions, textProcessor, TextProcessorOptions } from './text-processor'

export type ProcessorRegistry = { [key: string]: (element: any, dataSource: any) => any }

export interface ObjectProcessorOptions extends TextProcessorOptions {
  clone: <T>(value: T, customizer: (value: any, key: string) => any) => T
  processors?: ProcessorRegistry 
}

export const objectProcessor = (options: ObjectProcessorOptions) => {
  const mergedOptions = { ...defaultOptions, ...options! }
  const { clone, getValue, processors } = mergedOptions
  const processText = textProcessor(options)
  
  const process = <T = any>(value: T, dataSource: any = {}): T => {
    return clone<T>(value,
      (value: any, key: string) => {
        if (typeof value === 'string') {
          return processText(value, dataSource)
        } else if (Array.isArray(value)) {
          return value.filter(item => !item.if || getValue(dataSource, item.if))
            .map(item => process(item, dataSource))
        } else if (processors && processors[key]) {
          const processor = processors[key]
          return process(processor(value, dataSource), dataSource)
        }
      })
  }

  return process
}
