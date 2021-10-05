"use strict";
exports.__esModule = true;
exports.textProcessor = exports.dateFormat = exports.numberFormat = void 0;
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
var defaultOptions = {
    markStart: '{{',
    markEnd: '}}',
    getValue: function () { return 'novalue'; }
};
var textProcessor = function (_a) {
    var _b = _a === void 0 ? defaultOptions : _a, markStart = _b.markStart, markEnd = _b.markEnd, getValue = _b.getValue, formatNumber = _b.formatNumber, formatDate = _b.formatDate;
    var getter = getValue || (function (dataSource, dataPath) { return dataSource[dataPath]; });
    var formatNumberFunction = formatNumber || (0, exports.numberFormat)('de-ch');
    var formatDateFunction = formatDate || (0, exports.dateFormat)('de-ch');
    var getOptions = function (match) {
        var _a = match.split(';'), expression = _a[0], typeExpression = _a[1];
        var _b = expression.split('+'), expression1 = _b[0], addition = _b[1];
        var _c = expression1.split('!'), pathExpression = _c[0], defaultValue = _c[1];
        var dataPaths = pathExpression.split('|');
        var _d = typeExpression ? typeExpression.split(':') : [], type = _d[0], format = _d[1];
        return { dataPaths: dataPaths, defaultValue: defaultValue, addition: addition, type: type, format: format };
    };
    var normalizePath = function (value) {
        var result = value;
        if (result.startsWith(markStart)) {
            result = result.substr(markStart.length);
        }
        if (result.endsWith(markEnd)) {
            result = result.substr(0, result.length - markEnd.length);
        }
        return result;
    };
    var getValueFromDataSource = function (dataSource, _a) {
        var dataPaths = _a.dataPaths, defaultValue = _a.defaultValue, addition = _a.addition, type = _a.type, format = _a.format;
        var value = dataPaths.reduce(function (result, dataPath) {
            if (result !== null && result !== undefined) {
                return result;
            }
            return getter(dataSource, dataPath);
        }, null);
        if (!value && defaultValue) {
            value = defaultValue;
        }
        if (type === 'date') {
            value = value ? formatDateFunction(value, format) : '';
        }
        else if (type === 'number') {
            if (format && format.startsWith('-')) {
                var digits = format.substr(1);
                value = value ? formatNumberFunction(value, digits && parseInt(digits)) : '';
            }
            else {
                value = formatNumberFunction(value || 0, format && parseInt(format));
            }
        }
        else if (value) {
            value = value.toString();
        }
        else {
            value = '';
        }
        if (addition && value.length > 0) {
            value += addition;
        }
        return value;
    };
    return function (text, dataSource, keepMarks) {
        if (keepMarks === void 0) { keepMarks = false; }
        var matches = text.match(new RegExp("\\" + markStart + ".*?\\" + markEnd, 'g'));
        if (matches !== null) {
            matches.forEach(function (match) {
                var options = getOptions(normalizePath(match));
                var value = getValueFromDataSource(dataSource, options);
                if (value || !keepMarks) {
                    text = text.replace(match, value);
                }
            });
        }
        return text.trim();
    };
};
exports.textProcessor = textProcessor;
exports["default"] = exports.textProcessor;
