"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var find_object_1 = __importDefault(require("./find-object"));
var get_index_from_ref_1 = __importDefault(require("./get-index-from-ref"));
var createBufferPageWithAnnotation = function (pdf, info, pagesRef, widget) {
    var pagesDictionary = find_object_1.default(pdf, info.xref, pagesRef).toString();
    var splittedDictionary = pagesDictionary.split('/Annots')[0];
    var splittedIds = pagesDictionary.split('/Annots')[1];
    splittedIds = splittedIds === undefined ? '' : splittedIds.replace(/[\[\]]/g, ''); // eslint-disable-next-line no-useless-escape
    var pagesDictionaryIndex = get_index_from_ref_1.default(info.xref, pagesRef);
    var widgetValue = widget.toString();
    return Buffer.concat([
        Buffer.from(pagesDictionaryIndex + " 0 obj\n"),
        Buffer.from('<<\n'),
        Buffer.from(splittedDictionary + "\n"),
        Buffer.from("/Annots [" + splittedIds + " " + widgetValue + "]"),
        Buffer.from('\n>>\nendobj\n'),
    ]);
};
exports.default = createBufferPageWithAnnotation;
