"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MARKERS = [
    0xffc0,
    0xffc1,
    0xffc2,
    0xffc3,
    0xffc5,
    0xffc6,
    0xffc7,
    0xffc8,
    0xffc9,
    0xffca,
    0xffcb,
    0xffcc,
    0xffcd,
    0xffce,
    0xffcf,
];
var COLOR_SPACE_MAP = {
    1: 'DeviceGray',
    3: 'DeviceRGB',
    4: 'DeviceCMYK',
};
exports.getJpgImage = function (pdf, data) {
    if (data.readUInt16BE(0) !== 0xffd8) {
        throw 'SOI not found in JPEG';
    }
    var pos = 2;
    var marker;
    while (pos < data.length) {
        marker = data.readUInt16BE(pos);
        pos += 2;
        if (MARKERS.includes(marker)) {
            break;
        }
        pos += data.readUInt16BE(pos);
    }
    if (!MARKERS.includes(marker)) {
        throw 'Invalid JPEG.';
    }
    pos += 2;
    var bits = data[pos++];
    var height = data.readUInt16BE(pos);
    pos += 2;
    var width = data.readUInt16BE(pos);
    pos += 2;
    var channels = data[pos++];
    var colorSpace = COLOR_SPACE_MAP[channels];
    var baseJpgData = {
        Type: 'XObject',
        Subtype: 'Image',
        BitsPerComponent: bits,
        Width: width,
        Height: height,
        ColorSpace: colorSpace,
        Filter: 'DCTDecode',
    };
    if (colorSpace === 'DeviceCMYK') {
        baseJpgData['Decode'] = [1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0];
    }
    var image = pdf.ref(baseJpgData, null, data);
    return image;
};
