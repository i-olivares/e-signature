"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getIndexFromRef = function (refTable, ref) {
    var rawIndex = ref.split(' ')[0];
    var index = parseInt(rawIndex);
    if (!refTable.offsets.has(index)) {
        throw new Error("Failed to locate object \"" + ref + "\".");
    }
    return index;
};
exports.default = getIndexFromRef;
