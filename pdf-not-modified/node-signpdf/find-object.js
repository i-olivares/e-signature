"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getIndexFromRef = _interopRequireDefault(require("./get-index-from-ref"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Buffer} pdf
 * @param {Map} refTable
 * @returns {object}
 */
const findObject = (pdf, refTable, ref) => {
  console.log("ESTOY EN FIND OBJECT")
  const index = (0, _getIndexFromRef.default)(refTable, ref);
  console.log("index: ")
  console.log(index)
  const type = refTable.types.get(index);
  console.log("type:",type.charAt(0))
  if(type.charAt(0) === "c"){
    const object = refTable.offsets.get(index);
    console.log("object:",object)
    const offset = refTable.offsets.get(object);
    console.log("offset:", offset)
    var slice = readStream(pdf,offset,index)
  }else{
    const offset = refTable.offsets.get(index);
    console.log("offset:", offset)
    var slice = readObject(pdf,offset)
  }


  console.log("This is the resultant slice:")
  console.log(slice.toString())
  return slice
}


var readObject = function(pdf,offset){
  let slice = pdf.slice(offset);
  slice = slice.slice(0, slice.indexOf('endobj'));
  slice = slice.slice(slice.indexOf('<<') + 2);
  slice = slice.slice(0, slice.lastIndexOf('>>'));
  return slice
}


var readStream = function(pdf,offset,index){
  let slice = pdf.slice(offset);
  slice = slice.slice(0, slice.indexOf('endstream'));
  let info = slice.slice(slice.indexOf('<<') + 2);
  info = info.slice(0, info.lastIndexOf('>>')).toString();
  console.log("raw object info: ")
  console.log(info.toString())

  let n = parseInt(info.split('/N ')[1].split('/')[0])
  let first = parseInt(info.split('/First ')[1].split('/')[0])
  console.log("numero de objetos: ", n)
  console.log("offset bytes en el stream decodificado del primer objeto: ", first)


  let stream = slice.slice(slice.indexOf('>>stream')+10)
  console.log("raw object stream: ")
  console.log(stream.toString())
  var decodedStream  = pako.inflate(stream);
  var asciiStream = Buffer.from(decodedStream).toString('ascii')
  console.log("decompressed object stream:")
  console.log(decodedStream)
  console.log("To ascii?: ")
  console.log(Buffer.from(decodedStream).toString('ascii'))


  let compressedObjectsInfo = decodedStream.subarray(0,first-1)
  compressedObjectsInfo = Buffer.from(compressedObjectsInfo).toString('ascii')
  console.log("compressed objects info: ")
  console.log(compressedObjectsInfo)
  let compressedObjectsArray = parseInt(compressedObjectsInfo.split(' '))

  let compressedObjects = decodedStream.subarray(first,decodedStream.length-1)
  console.log("compressed objects (to ascii): ")
  console.log(Buffer.from(compressedObjects).toString('ascii'))

  for(var i =0; i<compressedObjectsInfo.length;i=i+2){
    if(compressedObjectsInfo[i] === index){
      var startingByte = compressedObjectsInfo[i+1]
      if( i+3 > compressedObjectsInfo.length){
        var endingByte = compressedObjects.length -1
      }else{
        var endingByte = compressedObjectsInfo[i+3]
      }

    }
  }




  let object = compressedObjects.subarray(startingByte,endingByte)
  object = Buffer.from(object).toString('ascii')
  console.log("This is the compressed object found:")
  console.log(object)


  return object.toString()
}


var _default = findObject;
exports.default = _default;
