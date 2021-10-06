"use strict";
exports.__esModule = true;
exports.defaultOptions = void 0;
var format_1 = require("./format");
exports.defaultOptions = {
    markStart: '{{',
    markEnd: '}}',
    getValue: function (dataSource, dataPath) { return dataSource[dataPath]; },
    formatNumber: (0, format_1.numberFormat)(),
    formatDate: (0, format_1.dateFormat)()
};
