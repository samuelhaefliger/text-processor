export interface Options {
  markStart: string
  markEnd: string
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

interface GetValueOptions {
  dataPaths: string[],
  defaultValue: any,
  addition?: string,
  type?: string,
  format?: string,
}

const defaultOptions: Options = {
  markStart: '{{',
  markEnd: '}}',
  getValue: () => 'novalue',
}

export const textProcessor = ({ markStart, markEnd, getValue, formatNumber, formatDate } = defaultOptions) => {
  const getter = getValue || ((dataSource: any, dataPath: string) => dataSource[dataPath])
  const formatNumberFunction = formatNumber || numberFormat('de-ch')
  const formatDateFunction = formatDate || dateFormat('de-ch')

  const getOptions = (match: string): GetValueOptions => {
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

  const getValueFromDataSource = (dataSource: any, { dataPaths, defaultValue, addition, type, format }: GetValueOptions) => {
    let value = dataPaths.reduce((result, dataPath) => { 
      if (result !== null && result !== undefined) {
        return result
      }
      return getter(dataSource, dataPath)
    }, null)

    if (!value && defaultValue) {
      value = defaultValue
    }

    if (type === 'date') {
      value = value ? formatDateFunction(value, format) : ''
    } else if (type === 'number') {
      if (format && format.startsWith('-')) {
        const digits = format.substr(1)
        value = value ? formatNumberFunction(value, digits && parseInt(digits)) : ''
      } else {
        value = formatNumberFunction(value || 0, format && parseInt(format))
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

export default textProcessor
