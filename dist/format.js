"use strict";
exports.__esModule = true;
exports.dateFormat = exports.numberFormat = void 0;
var numberFormat = function (locales) { return function (value, digits) {
    if (digits === void 0) { digits = 0; }
    return parseFloat(value)
        .toLocaleString(locales, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}; };
exports.numberFormat = numberFormat;
var dateFormat = function (locales) { return function (value) {
    return new Date(value).toLocaleString(locales, { day: '2-digit', month: '2-digit', year: 'numeric' });
}; };
exports.dateFormat = dateFormat;
