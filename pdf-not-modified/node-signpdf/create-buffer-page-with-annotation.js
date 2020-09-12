"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _findObject = _interopRequireDefault(require("./find-object"));

var _getIndexFromRef = _interopRequireDefault(require("./get-index-from-ref"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createBufferPageWithAnnotation = (pdf, info, pagesRef, widget) => {
  console.log("ESTOY EN CREATE BUFFER PAGE WITH ANNOTATIONS")
  console.log("info: ")
  console.log(info)
  console.log("pagesref: ")
  console.log(pagesRef)
  const pagesDictionary = (0, _findObject.default)(pdf, info.xref, pagesRef).toString(); // Extend page dictionary with newly created annotations
  console.log("pagesDictionary")
  console.log(pagesDictionary.toString())

  let annotsStart, annotsEnd, annots;
  annotsStart = pagesDictionary.indexOf('/Annots');

  if (annotsStart > -1) {
    annotsEnd = pagesDictionary.indexOf(']', annotsStart);
    annots = pagesDictionary.substr(annotsStart, annotsEnd + 1 - annotsStart);
    annots = annots.substr(0, annots.length - 1); // remove the trailing ]
  } else {
    annotsStart = pagesDictionary.length;
    annotsEnd = pagesDictionary.length;
    annots = '/Annots [';
  }

  const pagesDictionaryIndex = (0, _getIndexFromRef.default)(info.xref, pagesRef);
  console.log("pagesDictionaryIndex: ")
  console.log(pagesDictionaryIndex)
  console.log("Obtenido con info.xref: ")
  console.log(info.xref)
  console.log("y con pagesRef:")
  console.log(pagesRef)
  console.log("llamando a _getIndexFromRef")

  const widgetValue = widget.toString();
  annots = annots + ' ' + widgetValue + ']'; // add the trailing ] back
  console.log("Este es el widget creado:")
  console.log(annots)
  const preAnnots = pagesDictionary.substr(0, annotsStart);
  let postAnnots = '';

  if (pagesDictionary.length > annotsEnd) {
    postAnnots = pagesDictionary.substr(annotsEnd + 1);
  }
  console.log("This is the final buffer page with annotations:")
  console.log(Buffer.concat([Buffer.from(`${pagesDictionaryIndex} 0 obj\n`), Buffer.from('<<\n'), Buffer.from(`${preAnnots + annots + postAnnots}\n`), Buffer.from('\n>>\nendobj\n')]).toString())
  return Buffer.concat([Buffer.from(`${pagesDictionaryIndex} 0 obj\n`), Buffer.from('<<\n'), Buffer.from(`${preAnnots + annots + postAnnots}\n`), Buffer.from('\n>>\nendobj\n')]);
};

exports.default = createBufferPageWithAnnotation;
