"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var find_object_1 = __importDefault(require("./find-object"));
var get_pages_dictionary_ref_1 = __importDefault(require("./get-pages-dictionary-ref"));
var getPageRef = function (pdf, info, shouldAnnotationAppearOnFirstPage) {
    console.log("ESTOY EN GET PAGE REF")
    if (shouldAnnotationAppearOnFirstPage === void 0) { shouldAnnotationAppearOnFirstPage = false; }
    var pagesRef = get_pages_dictionary_ref_1.default(info);
    console.log("pagesRef:")
    console.log(pagesRef)
    var pagesDictionary = find_object_1.default(pdf, info.xref, pagesRef);
    console.log("pagesDictionary:")
    console.log(pagesDictionary.toString())
    var kidsPosition = pagesDictionary.indexOf('/Kids');
    var kidsStart = pagesDictionary.indexOf('[', kidsPosition) + 1;
    var kidsEnd = pagesDictionary.indexOf(']', kidsPosition);
    var pages = pagesDictionary.slice(kidsStart, kidsEnd).toString().trim();
    console.log("pages:")
    console.log(pages)
    //var split = shouldAnnotationAppearOnFirstPage ? pages.split('R ')[0] + " R" : "" + pages.split('R ')[pages.split('R ').length - 1];
    if(shouldAnnotationAppearOnFirstPage == (pages.split('R ').length - 1)) {
      var split = "" + pages.split('R ')[pages.split('R ').length - 1];
    }else{
      var split = pages.split('R ')[shouldAnnotationAppearOnFirstPage] + " R"
    }
    console.log("split:")
    console.log(split)
    return split;
};
exports.default = getPageRef;
