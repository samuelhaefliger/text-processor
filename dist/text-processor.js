"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.textProcessor = void 0;
var options_1 = require("./options");
var textProcessor = function (options) {
    var _a = __assign(__assign({}, options_1.defaultOptions), options), markStart = _a.markStart, markEnd = _a.markEnd, getValue = _a.getValue, formatNumber = _a.formatNumber, formatDate = _a.formatDate;
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
            return getValue(dataSource, dataPath);
        }, null);
        if (!value && defaultValue) {
            value = defaultValue;
        }
        if (type === 'date') {
            value = value ? formatDate(value, format) : '';
        }
        else if (type === 'number') {
            if (format && format.startsWith('-')) {
                var digits = format.substr(1);
                value = value ? formatNumber(value, digits && parseInt(digits)) : '';
            }
            else {
                value = formatNumber(value || 0, format && parseInt(format));
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
