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
exports.objectProcessor = void 0;
var text_processor_1 = require("./text-processor");
var options_1 = require("./options");
var utils_1 = require("./utils");
var objectProcessor = function (options) {
    var mergedOptions = __assign(__assign({}, options_1.defaultOptions), options);
    var clone = mergedOptions.clone, getValue = mergedOptions.getValue, processors = mergedOptions.processors;
    var processText = (0, text_processor_1.textProcessor)(options);
    var process = function (value, dataSource) {
        if (dataSource === void 0) { dataSource = {}; }
        return clone(value, function (value, key) {
            if ((0, utils_1.isString)(value)) {
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
