export const numberFormat = (locales?: string) => (value: any, digits = 0) => {
  return parseFloat(value)
    .toLocaleString(locales, { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export const dateFormat = (locales?: string) => (value: any) => {
  return new Date(value).toLocaleString(locales, { day: '2-digit', month: '2-digit', year: 'numeric' })
}
