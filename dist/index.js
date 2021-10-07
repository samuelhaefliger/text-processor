'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var numberFormat = function (locales) { return function (value, digits) {
    if (digits === void 0) { digits = 0; }
    return parseFloat(value)
        .toLocaleString(locales, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}; };
var dateFormat = function (locales) { return function (value) {
    return new Date(value).toLocaleString(locales, { day: '2-digit', month: '2-digit', year: 'numeric' });
}; };

var defaultOptions = {
    markStart: '{{',
    markEnd: '}}',
    getValue: function (dataSource, dataPath) { return dataSource[dataPath]; },
    formatNumber: numberFormat(),
    formatDate: dateFormat()
};

var dataPathRegex = /(?<dataPaths>[\w.\[\]\|]*)/;
var addtionRegex = /(\+(?<addition>[\w\s%:./"']*))?/;
var defaultValueRegex = /(!(?<defaultValue>[\w:.]*))?/;
var typeRegex = /(;(?<type>[\w]*)(:(?<format>[\w:.\-/\+]*))?)?/;
var regex = new RegExp(dataPathRegex.source.concat(addtionRegex.source, defaultValueRegex.source, typeRegex.source));
var parseOptions = function (value) {
    var matches = value.match(regex);
    return Object.keys(matches.groups)
        .reduce(function (options, key) {
        if (matches.groups[key]) {
            var value_1 = matches.groups[key];
            if (value_1) {
                options[key] = key === 'dataPaths' ? value_1.split('|') : value_1;
            }
        }
        return options;
    }, { dataPaths: [] });
};

var textProcessor = function (options) {
    var _a = __assign(__assign({}, defaultOptions), options), markStart = _a.markStart, markEnd = _a.markEnd, getValue = _a.getValue, formatNumber = _a.formatNumber, formatDate = _a.formatDate;
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
                var options = parseOptions(normalizePath(match));
                var value = getValueFromDataSource(dataSource, options);
                if (value || !keepMarks) {
                    text = text.replace(match, value);
                }
            });
        }
        return text.trim();
    };
};

var isString = function (value) {
    return typeof value === 'string';
};

var objectProcessor = function (options) {
    var mergedOptions = __assign(__assign({}, defaultOptions), options);
    var clone = mergedOptions.clone, getValue = mergedOptions.getValue, processors = mergedOptions.processors;
    var processText = textProcessor(options);
    var process = function (value, dataSource) {
        if (dataSource === void 0) { dataSource = {}; }
        return clone(value, function (value, key) {
            if (isString(value)) {
                return processText(value, dataSource);
            }
            else if (Array.isArray(value)) {
                return value.filter(function (item) { return !item["if"] || getValue(dataSource, item["if"]); })
                    .map(function (item) { return process(item, dataSource); });
            }
            else if (processors && processors[key]) {
                var processor = processors[key];
                return process(processor(value, dataSource), dataSource);
            }
        });
    };
    return process;
};

exports.objectProcessor = objectProcessor;
exports.textProcessor = textProcessor;
