export interface MatchOptions {
  dataPaths: string[],
  defaultValue?: string,
  addition?: string,
  type?: string,
  format?: string,
}

const dataPathRegex = /(?<dataPaths>[\w.\[\]\|]*)/
const addtionRegex = /(\+(?<addition>[\w\s%:./"']*))?/
const defaultValueRegex = /(!(?<defaultValue>[\w:.]*))?/
const typeRegex = /(;(?<type>[\w]*)(:(?<format>[\w:.\-/\+]*))?)?/

const regex = new RegExp(dataPathRegex.source.concat(addtionRegex.source, defaultValueRegex.source, typeRegex.source))

export const parseOptions = (value: string): MatchOptions => {
  const matches = value.match(regex)

  return Object.keys(matches.groups)
    .reduce<MatchOptions>((options, key) => {
      if (matches.groups[key]) {
        const value = matches.groups[key]
        if (value) {
          (options as any)[key] = key === 'dataPaths' ? value.split('|') : value
        }
      }
      return options
    }, { dataPaths: [] })
}
