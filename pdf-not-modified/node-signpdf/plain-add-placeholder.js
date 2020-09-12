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
var const_1 = require("./const");
var create_buffer_page_with_annotation_1 = __importDefault(require("./create-buffer-page-with-annotation"));
var create_buffer_page_with_pageRefObject = __importDefault(require("./create-buffer-page-with-pageRef-object"));
var create_buffer_root_with_acrofrom_1 = __importDefault(require("./create-buffer-root-with-acrofrom"));
var create_buffer_trailer_1 = __importDefault(require("./create-buffer-trailer"));
var get_pages_dictionary_ref_1 = __importDefault(require("./get-pages-dictionary-ref"));
var get_index_from_ref_1 = __importDefault(require("./get-index-from-ref"));
var get_page_ref_1 = __importDefault(require("./get-page-ref"));
var pdf_kit_add_placeholder_1 = __importDefault(require("./pdf-kit-add-placeholder"));
var pdf_kit_reference_mock_1 = __importDefault(require("./pdf-kit-reference-mock"));
var pdfobject_1 = require("./pdfkit/pdfobject");
var find_object_1 = __importDefault(require("./find-object"));
var read_pdf_1 = __importDefault(require("./read-pdf"));
var remove_trailing_new_line_1 = __importDefault(require("./remove-trailing-new-line"));
var plainAddPlaceholder = function (pdfBuffer, signatureOptions, signatureLength) {
    console.log("ESTOY EN PLAIN-ADD-PLACEHOLDER")
    if (signatureLength === void 0) { signatureLength = const_1.DEFAULT_SIGNATURE_LENGTH; }
    return __awaiter(void 0, void 0, void 0, function () {
        var pdf, info, pageRef, pageIndex, addedReferences, pdfKitMock, _a, form, widget, rootIndex;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Estoy en case 0")
                    console.log("pdf antes de quitarle el trailing:")
                    console.log(pdfBuffer.toString())
                    pdf = remove_trailing_new_line_1.default(pdfBuffer);
                    console.log("pdf tras quitarle el trailing:")
                    console.log(pdf.toString())
                    info = read_pdf_1.default(pdf);
                    console.log("info: ")
                    console.log(info)
                    pageRef = get_page_ref_1.default(pdf, info, signatureOptions.shouldAnnotationAppearOnFirstPage);
                    ////////////


                    console.log("pageRef:")
                    console.log(pageRef)
                    pageIndex = get_index_from_ref_1.default(info.xref, pageRef);
                    console.log("pageIndex:")
                    console.log(pageIndex)
                    addedReferences = new Map();
                    pdfKitMock = {
                        ref: function (input, additionalIndex, stream) {
                          console.log("Estoy en pdfKitMock ref function")
                            info.xref.maxIndex += 1;
                            console.log("info.xref.maxIndex += 1: ", info.xref.maxIndex)
                            console.log("input")
                            console.log(input)
                            console.log("additionalIndex:")
                            console.log(additionalIndex)
                            console.log("stream:")
                            console.log(stream)
                            var index = additionalIndex != null ? additionalIndex : info.xref.maxIndex;
                            addedReferences.set(index, pdf.length + 1);

                            console.log("These are the added references in case 0: ")
                            console.log(addedReferences)
                            pdf = getAssembledPdf(pdf, index, input, stream);
                            return new pdf_kit_reference_mock_1.default(info.xref.maxIndex);
                        },
                        page: {
                            dictionary: new pdf_kit_reference_mock_1.default(pageIndex, {
                                data: {
                                    Annots: [],
                                },
                            }),
                        },
                        _root: {
                            data: {},
                        },
                    };
                    return [4 /*yield*/, pdf_kit_add_placeholder_1.default({
                            pdf: pdfKitMock,
                            pdfBuffer: pdfBuffer,
                            signatureLength: signatureLength,
                            signatureOptions: signatureOptions,
                        })];
                case 1:
                    console.log("ESTOY EN CASE 1 DE PLAIN-ADD-PLACEHOLDER")
                    _a = _b.sent(),
                    form = _a.form,
                    widget = _a.widget;
                    console.log("_a:")
                    console.log(_a)
                    console.log("form:")
                    console.log(form)
                    console.log("widget:")
                    console.log(widget)

                    if (!isContainBufferRootWithAcrofrom(pdfBuffer)) {
                        rootIndex = get_index_from_ref_1.default(info.xref, info.rootRef);
                        addedReferences.set(rootIndex, pdf.length + 1);
                        pdf = Buffer.concat([pdf, Buffer.from('\n'), create_buffer_root_with_acrofrom_1.default(info, form)]);
                    }
                    console.log("This is the page index:")
                    console.log(pageIndex)
                    addedReferences.set(pageIndex, pdf.length + 1);
                    console.log("These are the added references: ")
                    console.log(addedReferences)
                    pdf = Buffer.concat([
                        pdf,
                        Buffer.from('\n'),
                        create_buffer_page_with_annotation_1.default(pdf, info, pageRef, widget),
                    ]);
                    var pagesDictRef = get_pages_dictionary_ref_1.default(info);
                    const pagesDictRefIndex = (0, get_index_from_ref_1.default)(info.xref, pagesDictRef);

                    addedReferences.set(pagesDictRefIndex, pdf.length + 1);
                    pdf = Buffer.concat([
                        pdf,
                        Buffer.from('\n'),
                        create_buffer_page_with_pageRefObject.default(pdf, info, pagesDictRef),
                    ]);

                    pdf = Buffer.concat([pdf, Buffer.from('\n'), create_buffer_trailer_1.default(pdf, info, addedReferences)]);
                    return [2 /*return*/, pdf];
            }
        });
    });
};
var getAssembledPdf = function (pdf, index, input, stream) {
    var finalPdf = pdf;
    finalPdf = Buffer.concat([
        finalPdf,
        Buffer.from('\n'),
        Buffer.from(index + " 0 obj\n"),
        Buffer.from(pdfobject_1.PDFObject.convert(input)),
    ]);
    if (stream) {
        finalPdf = Buffer.concat([
            finalPdf,
            Buffer.from('\nstream\n'),
            Buffer.from(stream),
            Buffer.from('\nendstream'),
        ]);
    }
    finalPdf = Buffer.concat([finalPdf, Buffer.from('\nendobj\n')]);
    return finalPdf;
};
var isContainBufferRootWithAcrofrom = function (pdf) {
    var bufferRootWithAcroformRefRegex = new RegExp('\\/AcroForm\\s+(\\d+\\s\\d+\\sR)', 'g');
    var match = bufferRootWithAcroformRefRegex.exec(pdf.toString());
    return match != null && match[1] != null && match[1] !== '';
};
exports.default = plainAddPlaceholder;
