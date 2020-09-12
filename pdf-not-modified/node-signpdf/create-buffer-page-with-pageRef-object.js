"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _findObject = _interopRequireDefault(require("./find-object"));

var _getIndexFromRef = _interopRequireDefault(require("./get-index-from-ref"));

var get_pages_dictionary_ref_1 = _interopRequireDefault(require("./get-pages-dictionary-ref"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createBufferPageWithPageRef = (pdf, info, pagesDictRef) => {
  console.log("ESTOY EN CREATE BUFFER PAGE REF OBJECT")
  console.log("info: ")
  console.log(info)

  //var pagesRef = get_pages_dictionary_ref_1.default(info);
  console.log("pagesDictRef:")
  console.log(pagesDictRef)
  var pagesDictionary = _findObject.default(pdf, info.xref, pagesDictRef);
  console.log("pagesDictionary:")
  console.log(pagesDictionary.toString())
  if(pagesDictionary.toString().substr(0,1) == '<'){
    pagesDictionary = pagesDictionary.slice(1)
  }
  if(pagesDictionary.toString().substr(0,1) == '<'){
    pagesDictionary = pagesDictionary.slice(1)
  }
  console.log("pagesDictionary.toString().substr(pagesDictionary.length-2,pagesDictionary.length-1) == > ?")
  console.log(pagesDictionary.toString().substr(pagesDictionary.length-1,pagesDictionary.length))
  console.log("pagesDictionary.slice(0,-1): ")
  console.log(pagesDictionary.slice(0,-1))
  if(pagesDictionary.toString().substr(pagesDictionary.length-1,pagesDictionary.length) == '>'){
    pagesDictionary = pagesDictionary.slice(0,-1)
  }

  if(pagesDictionary.toString().substr(pagesDictionary.length-1,pagesDictionary.length) == '>'){
    pagesDictionary = pagesDictionary.slice(0,-1)
  }
  var header = pagesDictRef.split('R')[0]+'obj\n'
  const pagesDictionaryIndex = (0, _getIndexFromRef.default)(info.xref, pagesDictRef);
  console.log("pagesDictionaryIndex: ")
  console.log(pagesDictionaryIndex)
  console.log("Obtenido con info.xref: ")
  console.log(info.xref)


  console.log("This is the final page dictionary reference object :")
  console.log(Buffer.concat([Buffer.from(`${pagesDictionaryIndex} 0 obj\n`), Buffer.from('<<\n'), Buffer.from(`${pagesDictionary}\n`), Buffer.from('\n>>\nendobj\n')]).toString())
  return Buffer.concat([Buffer.from(`${pagesDictionaryIndex} 0 obj\n`), Buffer.from('<<\n'), Buffer.from(`${pagesDictionary}\n`), Buffer.from('\n>>\nendobj\n')]);
};

exports.default = createBufferPageWithPageRef;
