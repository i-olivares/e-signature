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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var appender_1 = require("../image/appender");
var const_1 = require("./const");
var pdf_kit_reference_mock_1 = __importDefault(require("./pdf-kit-reference-mock"));
var specialCharacters = [
    'á',
    'Á',
    'é',
    'É',
    'í',
    'Í',
    'ó',
    'Ó',
    'ö',
    'Ö',
    'ő',
    'Ő',
    'ú',
    'Ú',
    'ű',
    'Ű',
];
var pdfkitAddPlaceholder = function (_a) {
    var pdf = _a.pdf, pdfBuffer = _a.pdfBuffer, _b = _a.signatureLength, signatureLength = _b === void 0 ? const_1.DEFAULT_SIGNATURE_LENGTH : _b, _c = _a.byteRangePlaceholder, byteRangePlaceholder = _c === void 0 ? const_1.DEFAULT_BYTE_RANGE_PLACEHOLDER : _c, signatureOptions = _a.signatureOptions;
    return __awaiter(void 0, void 0, void 0, function () {
        var acroFormPosition, isAcroFormExists, acroFormId, fieldIds, acroForm, FONT, ZAF, APFONT, hasImg, IMG, _d, AP, SIGNATURE, WIDGET, ACROFORM;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    acroFormPosition = pdfBuffer.lastIndexOf('/Type /AcroForm');
                    isAcroFormExists = acroFormPosition !== -1;
                    fieldIds = [];
                    if (isAcroFormExists) {
                        acroForm = getAcroForm(pdfBuffer, acroFormPosition);
                        acroFormId = getAcroFormId(acroForm);
                        fieldIds = getFieldIds(acroForm);
                    }
                    FONT = getFont(pdf, 'Helvetica');
                    ZAF = getFont(pdf, 'ZapfDingbats');
                    APFONT = getFont(pdf, 'Helvetica');
                    hasImg = (_f = (_e = signatureOptions.annotationAppearanceOptions) === null || _e === void 0 ? void 0 : _e.imageDetails) === null || _f === void 0 ? void 0 : _f.imagePath;
                    if (!hasImg) return [3 /*break*/, 2];
                    return [4 /*yield*/, appender_1.getImage(signatureOptions.annotationAppearanceOptions.imageDetails.imagePath, pdf)];
                case 1:
                    _d = _g.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _d = undefined;
                    _g.label = 3;
                case 3:
                    IMG = _d;
                    AP = getAnnotationApparance(pdf, IMG, APFONT, signatureOptions);
                    SIGNATURE = getSignature(pdf, byteRangePlaceholder, signatureLength, signatureOptions.reason, signatureOptions);
                    WIDGET = getWidget(pdf, fieldIds, SIGNATURE, AP, signatureOptions.annotationAppearanceOptions.signatureCoordinates);
                    ACROFORM = getAcroform(pdf, fieldIds, WIDGET, FONT, ZAF, acroFormId);
                    return [2 /*return*/, {
                            signature: SIGNATURE,
                            form: ACROFORM,
                            widget: WIDGET,
                        }];
            }
        });
    });
};
var getAcroform = function (pdf, fieldIds, WIDGET, FONT, ZAF, acroFormId) {
    return pdf.ref({
        Type: 'AcroForm',
        SigFlags: 3,
        Fields: __spreadArrays(fieldIds, [WIDGET]),
        DR: "<</Font\n<</Helvetica " + FONT.index + " 0 R/ZapfDingbats " + ZAF.index + " 0 R>>\n>>",
    }, acroFormId);
};
var getWidget = function (pdf, fieldIds, signature, AP, signatureCoordinates) {
    var signatureBaseName = 'Signature';
    return pdf.ref({
        Type: 'Annot',
        Subtype: 'Widget',
        FT: 'Sig',
        Rect: [
            signatureCoordinates.left,
            signatureCoordinates.bottom,
            signatureCoordinates.right,
            signatureCoordinates.top,
        ],
        V: signature,
        T: new String(signatureBaseName + (fieldIds.length + 1)),
        F: 4,
        AP: "<</N " + AP.index + " 0 R>>",
        P: pdf.page.dictionary,
        DA: new String('/Helvetica 0 Tf 0 g'),
    });
};
var getAnnotationApparance = function (pdf, IMG, APFONT, signatureOptions) {
    var resources = "<</Font <<\n/f1 " + APFONT.index + " 0 R\n>>>>";
    if (IMG != null) {
        resources = "<</XObject <<\n/Img" + IMG.index + " " + IMG.index + " 0 R\n>>\n/Font <<\n/f1 " + APFONT.index + " 0 R\n>>\n>>";
    }
    var xObject = {
        CropBox: [0, 0, 197, 70],
        Type: 'XObject',
        FormType: 1,
        BBox: [-10, 10, 197.0, 70.0],
        MediaBox: [0, 0, 197, 70],
        Subtype: 'Form',
        Resources: resources,
    };
    return pdf.ref(xObject, undefined, getStream(signatureOptions.annotationAppearanceOptions, IMG != null ? IMG.index : undefined));
};
var getStream = function (annotationAppearanceOptions, imgIndex) {
    var generatedContent = generateSignatureContents(annotationAppearanceOptions.signatureDetails);
    var generatedImage = '';
    if (imgIndex != null) {
        generatedImage = generateImage(annotationAppearanceOptions.imageDetails, imgIndex);
    }
    return getConvertedText("\n    1.0 1.0 1.0 rg\n    0.0 0.0 0.0 RG\n    q\n    " + generatedImage + "\n    0 0 0 rg\n    " + generatedContent + "\n    Q");
};
var generateImage = function (imageDetails, imgIndex) {
    var _a = imageDetails.transformOptions, rotate = _a.rotate, space = _a.space, stretch = _a.stretch, tilt = _a.tilt, xPos = _a.xPos, yPos = _a.yPos;
    return "\n    q\n    " + space + " " + rotate + " " + tilt + " " + stretch + " " + xPos + " " + yPos + " cm\n    /Img" + imgIndex + " Do\n    Q\n  ";
};
var generateSignatureContents = function (details) {
    var detailsAsPdfContent = details.map(function (detail, index) {
        var detailAsPdfContent = generateSignatureContent(detail);
        return detailAsPdfContent;
    });
    return detailsAsPdfContent.join('');
};
var generateSignatureContent = function (detail) {
    var _a = detail.transformOptions, rotate = _a.rotate, space = _a.space, tilt = _a.tilt, xPos = _a.xPos, yPos = _a.yPos;
    return "\n    BT\n    0 Tr\n    /f1 " + detail.fontSize + " Tf\n    " + space + " " + rotate + " " + tilt + " 1 " + xPos + " " + yPos + " Tm\n    (" + detail.value + ") Tj\n    ET\n  ";
};
var getFieldIds = function (acroForm) {
    var fieldIds = [];
    var acroFormFields = acroForm.slice(acroForm.indexOf('/Fields [') + 9, acroForm.indexOf(']'));
    fieldIds = acroFormFields
        .split(' ')
        .filter(function (_element, index) { return index % 3 === 0; })
        .map(function (fieldId) { return new pdf_kit_reference_mock_1.default(fieldId); });
    return fieldIds;
};
var getAcroForm = function (pdfBuffer, acroFormPosition) {
    var pdfSlice = pdfBuffer.slice(acroFormPosition - 12);
    var acroForm = pdfSlice.slice(0, pdfSlice.indexOf('endobj')).toString();
    return acroForm;
};
var getAcroFormId = function (acroForm) {
    var acroFormFirsRow = acroForm.split('\n')[0];
    var acroFormId = parseInt(acroFormFirsRow.split(' ')[0]);
    return acroFormId;
};
var getFont = function (pdf, baseFont) {
    return pdf.ref({
        Type: 'Font',
        BaseFont: baseFont,
        Encoding: 'WinAnsiEncoding',
        Subtype: 'Type1',
    });
};
var getSignature = function (pdf, byteRangePlaceholder, signatureLength, reason, signatureDetails) {
    return pdf.ref({
        Type: 'Sig',
        Filter: 'Adobe.PPKLite',
        SubFilter: 'adbe.pkcs7.detached',
        ByteRange: [0, byteRangePlaceholder, byteRangePlaceholder, byteRangePlaceholder],
        Contents: Buffer.from(String.fromCharCode(0).repeat(signatureLength)),
        Reason: new String(reason),
        M: new Date(),
        ContactInfo: new String("" + signatureDetails.email),
        Name: new String("" + signatureDetails.signerName),
        Location: new String("" + signatureDetails.location),
    });
};
var getConvertedText = function (text) {
    return text
        .split('')
        .map(function (character) {
        return specialCharacters.includes(character)
            ? getOctalCodeFromCharacter(character)
            : character;
    })
        .join('');
};
var getOctalCodeFromCharacter = function (character) {
    return '\\' + character.charCodeAt(0).toString(8);
};
exports.default = pdfkitAddPlaceholder;
