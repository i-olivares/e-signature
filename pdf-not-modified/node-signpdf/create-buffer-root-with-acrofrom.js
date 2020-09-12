"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_index_from_ref_1 = __importDefault(require("./get-index-from-ref"));
var createBufferRootWithAcroform = function (info, form) {
    var rootIndex = get_index_from_ref_1.default(info.xref, info.rootRef);
    return Buffer.concat([
        Buffer.from(rootIndex + " 0 obj\n"),
        Buffer.from('<<\n'),
        Buffer.from(info.root + "\n"),
        Buffer.from("/AcroForm " + form),
        Buffer.from('\n>>\nendobj\n'),
    ]);
};
exports.default = createBufferRootWithAcroform;
