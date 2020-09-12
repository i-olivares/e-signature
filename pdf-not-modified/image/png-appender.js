"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var png_js_1 = __importDefault(require("png-js"));
var zlib_1 = __importDefault(require("zlib"));
exports.getPngImage = function (pdf, data) { return __awaiter(void 0, void 0, void 0, function () {
    var image, hasAlphaChannel, pngBaseData, params, palette, val, rgb, mask, _i, rgb_1, x, indexedAlphaChannel, _a, imgData, alphaChannel, sMask, pngImage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                image = new png_js_1.default(data);
                hasAlphaChannel = image.hasAlphaChannel;
                pngBaseData = {
                    Type: 'XObject',
                    Subtype: 'Image',
                    BitsPerComponent: hasAlphaChannel ? 8 : image.bits,
                    Width: image.width,
                    Height: image.height,
                    Filter: 'FlateDecode',
                };
                if (!hasAlphaChannel) {
                    params = pdf.ref({
                        Predictor: 15,
                        Colors: image.colors,
                        BitsPerComponent: image.bits,
                        Columns: image.width,
                    });
                    pngBaseData['DecodeParms'] = params;
                }
                if (image.palette.length === 0) {
                    pngBaseData['ColorSpace'] = image.colorSpace;
                }
                else {
                    palette = pdf.ref({
                        stream: new Buffer(image.palette),
                    });
                    pngBaseData['ColorSpace'] = ['Indexed', 'DeviceRGB', image.palette.length / 3 - 1, palette];
                }
                if (!(image.transparency.grayscale != null)) return [3 /*break*/, 1];
                val = image.transparency.grayscale;
                pngBaseData['Mask'] = [val, val];
                return [3 /*break*/, 6];
            case 1:
                if (!image.transparency.rgb) return [3 /*break*/, 2];
                rgb = image.transparency.rgb;
                mask = [];
                for (_i = 0, rgb_1 = rgb; _i < rgb_1.length; _i++) {
                    x = rgb_1[_i];
                    mask.push(x, x);
                }
                pngBaseData['Mask'] = mask;
                return [3 /*break*/, 6];
            case 2:
                if (!image.transparency.indexed) return [3 /*break*/, 4];
                return [4 /*yield*/, getIndexedAlphaChannel(image)];
            case 3:
                indexedAlphaChannel = _b.sent();
                image.alphaChannel = indexedAlphaChannel;
                return [3 /*break*/, 6];
            case 4:
                if (!hasAlphaChannel) return [3 /*break*/, 6];
                return [4 /*yield*/, getSplittedAlphaChannelAndImageData(image)];
            case 5:
                _a = _b.sent(), imgData = _a.imgData, alphaChannel = _a.alphaChannel;
                image.imgData = imgData;
                image.alphaChannel = alphaChannel;
                sMask = getSmask(pdf, image, alphaChannel);
                pngBaseData['Mask'] = sMask;
                _b.label = 6;
            case 6:
                pngImage = pdf.ref(pngBaseData, undefined, image.imgData);
                return [2 /*return*/, pngImage];
        }
    });
}); };
var getIndexedAlphaChannel = function (image) { return __awaiter(void 0, void 0, void 0, function () {
    var transparency, alpaChannelPromise;
    return __generator(this, function (_a) {
        transparency = image.transparency.indexed;
        alpaChannelPromise = new Promise(function (resolve, reject) {
            image.decodePixels(function (pixels) {
                var alphaChannel = new Buffer(image.width * image.height);
                var i = 0;
                for (var j = 0, end = pixels.length; j < end; j++) {
                    alphaChannel[i++] = transparency[pixels[j]];
                }
                resolve(zlib_1.default.deflateSync(alphaChannel));
            });
        });
        return [2 /*return*/, alpaChannelPromise];
    });
}); };
var getSplittedAlphaChannelAndImageData = function (image) { return __awaiter(void 0, void 0, void 0, function () {
    var alpaChannelAndImageDataPromise;
    return __generator(this, function (_a) {
        alpaChannelAndImageDataPromise = new Promise(function (resolve, reject) {
            image.decodePixels(function (pixels) {
                var a, p;
                var colorCount = image.colors;
                var pixelCount = image.width * image.height;
                var imgData = new Buffer(pixelCount * colorCount);
                var alphaChannel = new Buffer(pixelCount);
                var i = (p = a = 0);
                var len = pixels.length;
                var skipByteCount = image.bits === 16 ? 1 : 0;
                while (i < len) {
                    for (var colorIndex = 0; colorIndex < colorCount; colorIndex++) {
                        imgData[p++] = pixels[i++];
                        i += skipByteCount;
                    }
                    alphaChannel[a++] = pixels[i++];
                    i += skipByteCount;
                }
                resolve({ imgData: zlib_1.default.deflateSync(imgData), alphaChannel: zlib_1.default.deflateSync(alphaChannel) });
            });
        });
        return [2 /*return*/, alpaChannelAndImageDataPromise];
    });
}); };
var getSmask = function (pdf, image, alphaChannel) {
    var sMask;
    if (image.hasAlphaChannel) {
        sMask = pdf.ref({
            Type: 'XObject',
            Subtype: 'Image',
            Height: image.height,
            Width: image.width,
            BitsPerComponent: 8,
            Filter: 'FlateDecode',
            ColorSpace: 'DeviceGray',
            Decode: [0, 1],
            stream: alphaChannel,
        });
    }
    return sMask;
};
