"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PDFAbstractReference = /** @class */ (function () {
    function PDFAbstractReference() {
    }
    PDFAbstractReference.prototype.toString = function () {
        throw new Error('Must be implemented by subclasses');
    };
    return PDFAbstractReference;
}());
exports.default = PDFAbstractReference;
