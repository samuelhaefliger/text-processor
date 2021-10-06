"use strict";
exports.__esModule = true;
exports.format = void 0;
var regex = /\[([^\[\]]|\[[^\[\]]*])*]|([A-Za-z])\2+|\.{3}|./g;
var compile = function (formatString) {
    var pattern = [];
    var keys;
    while (keys = regex.exec(formatString)) {
        pattern[pattern.length] = keys[0];
    }
    return pattern;
};
var formatter = {
    YYYY: function (d) { return ('000' + d.getFullYear()).slice(-4); },
    YY: function (d) { return ('0' + d.getFullYear()).slice(-2); },
    Y: function (d) { return '' + d.getFullYear(); },
    MM: function (d) { return ('0' + (d.getMonth() + 1)).slice(-2); },
    M: function (d) { return '' + (d.getMonth() + 1); },
    DD: function (d) { return ('0' + d.getDate()).slice(-2); },
    D: function (d) { return '' + d.getDate(); },
    HH: function (d) { return ('0' + d.getHours()).slice(-2); },
    H: function (d) { return '' + d.getHours(); },
    hh: function (d) { return ('0' + (d.getHours() % 12 || 12)).slice(-2); },
    h: function (d) { return '' + (d.getHours() % 12 || 12); },
    mm: function (d) { return ('0' + d.getMinutes()).slice(-2); },
    m: function (d) { return '' + d.getMinutes(); },
    ss: function (d) { return ('0' + d.getSeconds()).slice(-2); },
    s: function (d) { return '' + d.getSeconds(); },
    SSS: function (d) { return ('00' + d.getMilliseconds()).slice(-3); },
    SS: function (d) { return ('0' + (d.getMilliseconds() / 10 | 0)).slice(-2); },
    S: function (d) { return '' + (d.getMilliseconds() / 100 | 0); },
    Z: function (d) {
        var offset = d.getTimezoneOffset() / 0.6 | 0;
        return (offset > 0 ? '-' : '+') + ('000' + Math.abs(offset - (offset % 100 * 0.4 | 0))).slice(-4);
    }
};
var format = function (value, format) {
    return compile(format).reduce(function (result, token) { return result.concat(formatter[token] ? formatter[token](value) : token); }, '');
};
exports.format = format;
