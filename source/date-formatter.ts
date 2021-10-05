const compile = (formatString: string) => {
  var re = /\[([^\[\]]|\[[^\[\]]*])*]|([A-Za-z])\2+|\.{3}|./g, keys, pattern = [formatString]

  while (keys = re.exec(formatString)) {
      pattern[pattern.length] = keys[0]
  }
  return pattern
}

const formatter: any = {
  YYYY: function (d: any) { return ('000' + d.getFullYear()).slice(-4); },
  YY: function (d: any) { return ('0' + d.getFullYear()).slice(-2); },
  Y: function (d: any) { return '' + d.getFullYear(); },
  MM: function (d: any) { return ('0' + (d.getMonth() + 1)).slice(-2); },
  M: function (d: any) { return '' + (d.getMonth() + 1); },
  DD: function (d: any) { return ('0' + d.getDate()).slice(-2); },
  D: function (d: any) { return '' + d.getDate(); },
  HH: function (d: any) { return ('0' + d.getHours()).slice(-2); },
  H: function (d: any) { return '' + d.getHours(); },
  hh: function (d: any) { return ('0' + (d.getHours() % 12 || 12)).slice(-2); },
  h: function (d: any) { return '' + (d.getHours() % 12 || 12); },
  mm: function (d: any) { return ('0' + d.getMinutes()).slice(-2); },
  m: function (d: any) { return '' + d.getMinutes(); },
  ss: function (d: any) { return ('0' + d.getSeconds()).slice(-2); },
  s: function (d: any) { return '' + d.getSeconds(); },
  SSS: function (d: any) { return ('00' + d.getMilliseconds()).slice(-3); },
  SS: function (d: any) { return ('0' + (d.getMilliseconds() / 10 | 0)).slice(-2); },
  S: function (d: any) { return '' + (d.getMilliseconds() / 100 | 0); },
  Z: function (d: any) {
      var offset = d.getTimezoneOffset() / 0.6 | 0;
      return (offset > 0 ? '-' : '+') + ('000' + Math.abs(offset - (offset % 100 * 0.4 | 0))).slice(-4);
  },
}

export const format = (value: any, format: string) => {
  return compile(format)
    .slice(1)
    .reduce(
      (result, token) => result
        .concat(formatter[token] ? formatter[token](value) : token),
      '')
}
