"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var remove_trailing_new_line_1 = __importDefault(require("./remove-trailing-new-line"));
exports.addSignatureToPdf = function (pdf, sigContentsPosition, signature) {
    pdf = Buffer.concat([
        pdf.slice(0, sigContentsPosition),
        Buffer.from("<" + signature + ">"),
        pdf.slice(sigContentsPosition),
    ]);
    return pdf;
};
exports.replaceByteRangeInPdf = function (pdfBuffer) {
    if (!(pdfBuffer instanceof Buffer)) {
        throw new Error('PDF expected as Buffer.');
    }
    var pdf = remove_trailing_new_line_1.default(pdfBuffer);
    console.log("PDF AFTER REMOVE TRAILING NEW LINE")
    console.log(pdf.toString())
    var byteRangePlaceholder = [
        0,
        "/" + const_1.DEFAULT_BYTE_RANGE_PLACEHOLDER,
        "/" + const_1.DEFAULT_BYTE_RANGE_PLACEHOLDER,
        "/" + const_1.DEFAULT_BYTE_RANGE_PLACEHOLDER,
    ];
    var byteRangeString = "/ByteRange [" + byteRangePlaceholder.join(' ') + "]";
    console.log("byteRangeString: ")
    console.log(byteRangeString)
    var byteRangePos = pdf.indexOf(byteRangeString);
    if (byteRangePos === -1) {
        throw new Error("Could not find ByteRange placeholder: " + byteRangeString);
    }
    var byteRangeEnd = byteRangePos + byteRangeString.length;
    var contentsTagPos = pdf.indexOf('/Contents ', byteRangeEnd);
    var placeholderPos = pdf.indexOf('<', contentsTagPos);
    var placeholderEnd = pdf.indexOf('>', placeholderPos);
    var placeholderLengthWithBrackets = placeholderEnd + 1 - placeholderPos;
    var placeholderLength = placeholderLengthWithBrackets - 2;
    var byteRange = getByteRange(placeholderPos, placeholderLengthWithBrackets, pdf.length);
    var actualByteRange = "/ByteRange [" + byteRange.join(' ') + "]";
    actualByteRange += ' '.repeat(byteRangeString.length - actualByteRange.length);
    pdf = Buffer.concat([
        pdf.slice(0, byteRangePos),
        Buffer.from(actualByteRange),
        pdf.slice(byteRangeEnd),
    ]);
    pdf = Buffer.concat([
        pdf.slice(0, byteRange[1]),
        pdf.slice(byteRange[2], byteRange[2] + byteRange[3]),
    ]);
    return { pdf: pdf, placeholderLength: placeholderLength, byteRange: byteRange };
};
var getByteRange = function (placeholderPos, placeholderLengthWithBrackets, pdfLength) {
    var byteRange = [0, 0, 0, 0];
    byteRange[1] = placeholderPos;
    byteRange[2] = byteRange[1] + placeholderLengthWithBrackets;
    byteRange[3] = pdfLength - byteRange[2];
    return byteRange;
};
