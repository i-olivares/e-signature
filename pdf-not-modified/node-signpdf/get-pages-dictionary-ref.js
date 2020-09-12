"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getPagesDictionaryRef = function (info) {
    var isNotContainCatalogPositionWithSpace = info.root.toString().indexOf('/Type /Catalog') === -1;
    var isNotContainCatalogPositionWithoutSpace = info.root.toString().indexOf('/Type/Catalog') === -1;
    if (isNotContainCatalogPositionWithSpace && isNotContainCatalogPositionWithoutSpace) {
        throw new Error('Failed to find the pages descriptor. This is probably a problem in node-signpdf.');
    }
    var pagesRefRegex = new RegExp('\\/Pages\\s+(\\d+\\s\\d+\\sR)', 'g');
    var match = pagesRefRegex.exec(info.root);
    if (match == null) {
        throw new Error('Cant find a value for this regexp pattern.');
    }
    return match[1];
};
exports.default = getPagesDictionaryRef;
