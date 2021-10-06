export interface TextProcessorOptions {
  markStart?: string
  markEnd?: string
  getValue?: (dataSource: any, dataPath: string) => any
  locales?: string
  formatNumber?: (value: any, digits?: number) => string
  formatDate?: (value: any, format?: string) => string
}

export const numberFormat = (locales: string) => (value: any, digits = 0) => {
  return parseFloat(value)
    .toLocaleString(locales, { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export const dateFormat = (locales: string) => (value: any) => {
  return new Date(value).toLocaleString(locales, { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface MatchOptions {
  dataPaths: string[],
  defaultValue: any,
  addition?: string,
  type?: string,
  format?: string,
}

export const defaultOptions: TextProcessorOptions = {
  markStart: '{{',
  markEnd: '}}',
  getValue: (dataSource: any, dataPath: string) => dataSource[dataPath],
  formatNumber: numberFormat('de-ch'),
  formatDate: dateFormat('de-ch'),
}

export const textProcessor = (options?: TextProcessorOptions) => {
  const { markStart, markEnd, getValue, formatNumber, formatDate } = { ...defaultOptions, ...options! }

  const getOptions = (match: string): MatchOptions => {
    const [expression, typeExpression] = match.split(';')
  
    const [expression1, addition] = expression.split('+')
    const [pathExpression, defaultValue] = expression1.split('!')
  
    const dataPaths = pathExpression.split('|')
  
    const [type, format] = typeExpression ? typeExpression.split(':') : []
  
    return { dataPaths, defaultValue, addition, type, format }
  }
  
  const normalizePath = (value: string) => {
    let result = value
    if (result.startsWith(markStart)) {
      result = result.substr(markStart.length)
    }
  
    if (result.endsWith(markEnd)) {
      result = result.substr(0, result.length-markEnd.length)
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
        const options = getOptions(normalizePath(match))
        const value = getValueFromDataSource(dataSource, options)

        if (value || !keepMarks) {
          text = text.replace(match, value)
        }
      })
    }

    return text.trim()
  }
}
