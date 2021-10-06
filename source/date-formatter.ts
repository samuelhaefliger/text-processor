const regex = /\[([^\[\]]|\[[^\[\]]*])*]|([A-Za-z])\2+|\.{3}|./g

const compile = (formatString: string) => {
  const pattern = []

  let keys
  while (keys = regex.exec(formatString)) {
    pattern[pattern.length] = keys[0]
  }
  return pattern
}

const formatter: any = {
  YYYY: (d: any) => { return ('000' + d.getFullYear()).slice(-4); },
  YY: (d: any) => { return ('0' + d.getFullYear()).slice(-2); },
  Y: (d: any) => { return '' + d.getFullYear(); },
  MM: (d: any) => { return ('0' + (d.getMonth() + 1)).slice(-2); },
  M: (d: any) => { return '' + (d.getMonth() + 1); },
  DD: (d: any) => { return ('0' + d.getDate()).slice(-2); },
  D: (d: any) => { return '' + d.getDate(); },
  HH: (d: any) => { return ('0' + d.getHours()).slice(-2); },
  H: (d: any) => { return '' + d.getHours(); },
  hh: (d: any) => { return ('0' + (d.getHours() % 12 || 12)).slice(-2); },
  h: (d: any) => { return '' + (d.getHours() % 12 || 12); },
  mm: (d: any) => { return ('0' + d.getMinutes()).slice(-2); },
  m: (d: any) => { return '' + d.getMinutes(); },
  ss: (d: any) => { return ('0' + d.getSeconds()).slice(-2); },
  s: (d: any) => { return '' + d.getSeconds(); },
  SSS: (d: any) => { return ('00' + d.getMilliseconds()).slice(-3); },
  SS: (d: any) => { return ('0' + (d.getMilliseconds() / 10 | 0)).slice(-2); },
  S: (d: any) => { return '' + (d.getMilliseconds() / 100 | 0); },
  Z: (d: any) => {
      var offset = d.getTimezoneOffset() / 0.6 | 0;
      return (offset > 0 ? '-' : '+') + ('000' + Math.abs(offset - (offset % 100 * 0.4 | 0))).slice(-4);
  },
}

export const format = (value: any, format: string) => {
  return compile(format).reduce(
    (result, token) => result.concat(formatter[token] ? formatter[token](value) : token),
    '')
}
