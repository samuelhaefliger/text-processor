import { defaultOptions, Options } from './options'
import { MatchOptions, parseOptions } from './parser'

export const textProcessor = (options?: Options) => {
  const { markStart, markEnd, getValue, formatNumber, formatDate } = { ...defaultOptions, ...options! }
  
  const normalizePath = (value: string) => {
    let result = value
    if (result.startsWith(markStart)) {
      result = result.substr(markStart.length)
    }
  
    if (result.endsWith(markEnd)) {
      result = result.substr(0, result.length - markEnd.length)
    }
  
    return result
  }

  const getValueFromDataSource = (dataSource: any, { dataPaths, defaultValue, addition, type, format }: MatchOptions) => {
    let value = dataPaths.reduce((result, dataPath) => { 
      if (result !== null && result !== undefined) {
        return result
      }
      return getValue(dataSource, dataPath)
    }, null)

    if (!value && defaultValue) {
      value = defaultValue
    }

    if (type === 'date') {
      value = value ? formatDate(value, format) : ''
    } else if (type === 'number') {
      if (format && format.startsWith('-')) {
        const digits = format.substr(1)
        value = value ? formatNumber(value, digits && parseInt(digits)) : ''
      } else {
        value = formatNumber(value || 0, format && parseInt(format))
      }
    } else if (value) {
      value = value.toString()
    } else {
      value = ''
    }

    if (addition && value.length > 0) {
      value += addition
    }

    return value
  }

  return (text: string, dataSource: any, keepMarks: boolean = false) => {
    var matches = text.match(new RegExp(`\\${markStart}.*?\\${markEnd}`, 'g'))
    
    if (matches !== null) {
      matches.forEach(match => {
        const options = parseOptions(normalizePath(match))
        const value = getValueFromDataSource(dataSource, options)

        if (value || !keepMarks) {
          text = text.replace(match, value)
        }
      })
    }

    return text.trim()
  }
}
