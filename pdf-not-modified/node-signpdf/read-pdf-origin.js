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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var find_object_1 = __importDefault(require("./find-object"));
var readPdf = function (pdf) {
    var trailerStart = pdf.lastIndexOf('trailer');
    var trailer = pdf.slice(trailerStart, pdf.length - 6);
    var rawXRefPosition = trailer.slice(trailer.lastIndexOf('startxref') + 10).toString();
    var xRefPosition = parseInt(rawXRefPosition);
    var refTable = readRefTable(pdf);
    var rootSlice = trailer.slice(trailer.indexOf('/Root'));
    rootSlice = rootSlice.slice(0, rootSlice.indexOf('/', 1));
    var rootRef = rootSlice
        .slice(6)
        .toString()
        .trim(); // /Root + at least one space
    var root = find_object_1.default(pdf, refTable, rootRef).toString();
    if (refTable.maxOffset > xRefPosition) {
        throw new Error('Ref table is not at the end of the document. This document can only be signed in incremental mode.');
    }
    return {
        xref: refTable,
        rootRef: rootRef,
        root: root,
        trailerStart: trailerStart,
        previousXrefs: [],
        xRefPosition: xRefPosition,
    };
};
var readRefTable = function (pdf) {
    var offsetsMap = new Map();
    console.log("EMPIEZO EL TRABAJO: ESTOY EN READ REF TABLE:")
    console.log("ESTE ES EL PDF:")
    console.log(pdf)
    var fullXrefTable = getFullXrefTable(pdf);
    console.log("THIS IS THE FULL XREF TABLE: ")
    console.log(fullXrefTable )
    var startingIndex = 0;
    var maxOffset = 0;
    var maxIndex = Object.keys(fullXrefTable).length - 1;
    Object.keys(fullXrefTable).forEach(function (id) {
        var offset = parseInt(fullXrefTable[id]);
        maxOffset = Math.max(maxOffset, offset);
        offsetsMap.set(parseInt(id), offset);
    });
    return {
        maxOffset: maxOffset,
        startingIndex: startingIndex,
        maxIndex: maxIndex,
        offsets: offsetsMap,
    };
};
var getFullXrefTable = function (pdf) {
  console.log("IM AT GET FULL XREF TABLE:")
    var lastTrailerPosition = getLastTrailerPosition(pdf);

    console.log("lastTrailerPosition: ",lastTrailerPosition)
    var lastXrefTable = getXref(pdf, lastTrailerPosition);
    console.log("lastXrefTable: ",lastXrefTable)
    console.log("lastXrefTable.prev: ",lastXrefTable.prev)
    if (lastXrefTable.prev === undefined) {
      console.log("lastXrefTable.xRefContent: ",lastXrefTable.xRefContent)
        return lastXrefTable.xRefContent;
    }

    var pdfWithoutLastTrailer = pdf.slice(0, lastTrailerPosition);
    console.log("pdfWithoutLastTrailer:")
    console.log(pdfWithoutLastTrailer)
    console.log("ENTRO EN BUCLE HASTA QUE NO HAYA MÁS TRAILERS")
    var partOfXrefTable = getFullXrefTable(pdfWithoutLastTrailer);
    var mergedXrefTable = __assign(__assign({}, partOfXrefTable), lastXrefTable.xRefContent);
    console.log("mergedXrefTable:")
    console.log(mergedXrefTable.toString())
    console.log("SALGO DE GET FULL XREF TABLE")
    return mergedXrefTable;
};
var getLastTrailerPosition = function (pdf) {
    console.log("IM AT GET LAST TRAILER POSITION:")
    console.log("pdf: ")
    console.log(pdf)
    var trailerStart = pdf.lastIndexOf('trailer');
    console.log("pdf[trailerStart+1].toString(): ", pdf[trailerStart+1].toString())
    console.log("trailerStart: ",trailerStart)
    console.log("pdf.length-6 = ",pdf.length-6 )
    var trailer = pdf.slice(trailerStart, pdf.length - 6);
    console.log("trailer: ",trailer.toString())
    var xRefPosition = trailer.slice(trailer.lastIndexOf('startxref') + 10).toString();
    console.log("xRefPosition: ",xRefPosition)
    return parseInt(xRefPosition);
};
var getXref = function (pdf, position) {
    console.log("IM AT GET XREF:")
    var refTable = pdf.slice(position);
    console.log("refTable: ")
    console.log(refTable.toString())
    refTable = refTable.slice(4);
    console.log("refTable.slice(4): ")
    console.log(refTable.toString())
    refTable = refTable.slice(refTable.indexOf('\n') + 1);
    console.log("refTable=refTable.slice(refTable.indexOf('\n') + 1): ")
    console.log(refTable.toString())
    var size = refTable.toString().split('/Size')[1];
    console.log("size = refTable.toString().split('/Size')[1]: ")
    console.log(size.toString())
    var _a = refTable.toString().split('trailer'), objects = _a[0], infos = _a[1];
    console.log("_a= refTable.toString().split('trailer'):")
    console.log(_a)
    console.log("objects = _a[0]: ")
    console.log(_a[0])
    console.log("infos = _a[1]:")
    console.log(_a[1])
    var isContainingPrev = infos.split('/Prev')[1] != null;
    console.log("isContainingPrev:",isContainingPrev)
    var prev;
    var xRefContent;
    if (isContainingPrev) {
        var pagesRefRegex = new RegExp('Prev (\\d+)', 'g');
        console.log("pagesRefRegex: ",pagesRefRegex)
        var match = pagesRefRegex.exec(infos);
        console.log("match = pagesRefRegex.exec(infos): ", match)
        if (match == null) {
            throw new Error('Cant find value for this regexp Pattern');
        }
        prev = match[1];
        console.log("prev = match[1]: ", prev)
        xRefContent = objects
            .split('\n')
            .filter(function (l) { return l !== ''; })
            .reduce(parseTrailerXref, {});
       console.log("xRefContent = objects.split(n).filter(function (l) { return l !== ''; }).reduce(parseTrailerXref, {}): ")
       console.log(xRefContent)
    }
    else {
        xRefContent = objects
            .split('\n')
            .filter(function (l) { return l !== ''; })
            .reduce(parseRootXref, {});
        console.log("xRefContent = objects.split(n).filter(function (l) { return l !== ''; }).reduce(parseRootXref, {}): ")
        console.log(xRefContent)
    }

    console.log("return: size =", size, "prev= ", prev, "RefContent = ", xRefContent)
    return {
        size: size,
        prev: prev,
        xRefContent: xRefContent,
    };
};

var parseRootXref = function (prev, l, i) {
    var _a;
    var element = l.split(' ')[0];
    var isPageObject = parseInt(element) === 0 && element.length > 3;
    if (isPageObject) {
        return __assign(__assign({}, prev), { 0: 0 });
    }
    var offset = l.split(' ')[0];
    return __assign(__assign({}, prev), (_a = {}, _a[i - 1] = parseInt(offset), _a));
};
var parseTrailerXref = function (prev, curr, _index, array) {
    var _a, _b;
    if (array.length === 1) {
        return {};
    }
    var isObjectId = curr.split(' ').length === 2;
    if (isObjectId) {
        var id = curr.split(' ')[0];
        return __assign(__assign({}, prev), (_a = {}, _a[id] = undefined, _a));
    }
    var offset = curr.split(' ')[0];
    var prevId = Object.keys(prev).find(function (id) { return prev[id] === undefined; });
    if (prevId === undefined) {
        return prev;
    }
    return __assign(__assign({}, prev), (_b = {}, _b[prevId] = parseInt(offset), _b));
};
exports.default = readPdf;
