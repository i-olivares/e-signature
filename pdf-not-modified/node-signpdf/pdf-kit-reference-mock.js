"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_reference_1 = __importDefault(require("./pdfkit/abstract_reference"));
var PDFKitReferenceMock = /** @class */ (function (_super) {
    __extends(PDFKitReferenceMock, _super);
    function PDFKitReferenceMock(index, additionalData) {
        if (additionalData === void 0) { additionalData = undefined; }
        var _this = _super.call(this) || this;
        _this.index = index;
        if (typeof additionalData !== 'undefined') {
            Object.assign(_this, additionalData);
        }
        return _this;
    }
    PDFKitReferenceMock.prototype.toString = function () {
        return this.index + " 0 R";
    };
    return PDFKitReferenceMock;
}(abstract_reference_1.default));
exports.default = PDFKitReferenceMock;
