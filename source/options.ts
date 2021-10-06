import { dateFormat, numberFormat } from './format'

export interface Options {
  markStart?: string
  markEnd?: string
  getValue?: (dataSource: any, dataPath: string) => any
  locales?: string
  formatNumber?: (value: any, digits?: number) => string
  formatDate?: (value: any, format?: string) => string
}

export const defaultOptions: Options = {
  markStart: '{{',
  markEnd: '}}',
  getValue: (dataSource: any, dataPath: string) => dataSource[dataPath],
  formatNumber: numberFormat(),
  formatDate: dateFormat(),
}
