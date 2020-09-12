"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_reference_1 = __importDefault(require("./abstract_reference"));
var pad = function (str, length) { return (Array(length + 1).join('0') + str).slice(-length); };
var escapableRe = /[\n\r\t\b\f\(\)\\]/g;
var escapable = {
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\b': '\\b',
    '\f': '\\f',
    '\\': '\\\\',
    '(': '\\(',
    ')': '\\)',
};
var swapBytes = function (buff) {
    var bufferLength = buff.length;
    if (bufferLength & 0x01) {
        throw new Error('Buffer length must be even');
    }
    else {
        for (var i = 0, end = bufferLength - 1; i < end; i += 2) {
            var a = buff[i];
            buff[i] = buff[i + 1];
            buff[i + 1] = a;
        }
    }
    return buff;
};
var PDFObject = /** @class */ (function () {
    function PDFObject() {
    }
    PDFObject.convert = function (object, encryptFunction) {
        if (encryptFunction === void 0) { encryptFunction = null; }
        if (typeof object === 'string') {
            return "/" + object;
        }
        if (object instanceof String) {
            return PDFObject.getConvertedString(object, encryptFunction);
        }
        if (Buffer.isBuffer(object)) {
            return "<" + object.toString('hex') + ">";
        }
        if (object instanceof abstract_reference_1.default) {
            var convertedObject = object;
            return convertedObject.toString();
        }
        if (object instanceof Date) {
            return PDFObject.getConvertedDate(object, encryptFunction);
        }
        if (Array.isArray(object)) {
            var items = object.map(function (e) { return PDFObject.convert(e, encryptFunction); }).join(' ');
            return "[" + items + "]";
        }
        if ({}.toString.call(object) === '[object Object]') {
            return PDFObject.getConvertedObject(object, encryptFunction);
        }
        if (typeof object === 'number') {
            return String(PDFObject.getConvertedNumber(object));
        }
        return "" + object;
    };
    PDFObject.getConvertedObject = function (object, encryptFunction) {
        var out = ['<<'];
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                var val = object[key];
                var checkedValue = '';
                if (val != null && val.toString().indexOf('<<') !== -1) {
                    checkedValue = val;
                }
                else {
                    checkedValue = PDFObject.convert(val, encryptFunction);
                }
                out.push("/" + key + " " + checkedValue);
            }
        }
        out.push('>>');
        return out.join('\n');
    };
    PDFObject.getConvertedDate = function (object, encryptFunction) {
        var string = "D:" + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth() + 1, 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + "Z";
        if (encryptFunction) {
            string = encryptFunction(Buffer.from(string, 'ascii')).toString('binary');
            string = string.replace(escapableRe, function (c) { return escapable[c]; });
        }
        return "(" + string + ")";
    };
    PDFObject.getConvertedString = function (object, encryptFunction) {
        var string = object;
        var isUnicode = false;
        for (var i = 0, end = string.length; i < end; i += 1) {
            if (string.charCodeAt(i) > 0x7f) {
                isUnicode = true;
                break;
            }
        }
        var stringBuffer;
        if (isUnicode) {
            stringBuffer = swapBytes(Buffer.from("\uFEFF" + string, 'utf16le'));
        }
        else {
            stringBuffer = Buffer.from(string, 'ascii');
        }
        if (encryptFunction) {
            string = encryptFunction(stringBuffer).toString('binary');
        }
        else {
            string = stringBuffer.toString('binary');
        }
        string = string.replace(function (escapableRe, c) { return escapable[c]; });
        return "(" + string + ")";
    };
    PDFObject.getConvertedNumber = function (n) {
        if (n > -1e21 && n < 1e21) {
            return Math.round(n * 1e6) / 1e6;
        }
        throw new Error("unsupported number: " + n);
    };
    return PDFObject;
}());
exports.PDFObject = PDFObject;
