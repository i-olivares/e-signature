"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_index_from_ref_1 = __importDefault(require("./get-index-from-ref"));
var findObject = function (pdf, refTable, ref) {
    var index = get_index_from_ref_1.default(refTable, ref);
    var offset = refTable.offsets.get(index);
    var slice = pdf.slice(offset);
    slice = slice.slice(0, slice.indexOf('endobj'));
    slice = slice.slice(slice.indexOf('<<') + 2);
    slice = slice.slice(0, slice.lastIndexOf('>>'));
    return slice;
};
exports.default = findObject;
