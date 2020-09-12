"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var find_object_1 = __importDefault(require("./find-object"));
var readPdf = function (pdf) {

    var startxrefPosition = pdf.lastIndexOf('startxref')
    var rawXRefPosition = pdf.slice(startxrefPosition + 10).toString();
    var xRefPosition = parseInt(rawXRefPosition);
    console.log("parsed xRefPosition:",xRefPosition)

    var refTable = readRefTable(pdf,xRefPosition);
    console.log("Esta es la tabla final de referencia extraida:")
    console.log(refTable)


    var infoSlice = pdf.slice(xRefPosition)
    var firstEOF = infoSlice.indexOf('%%EOF',1)
    var info = infoSlice.slice(0,firstEOF)

    var rootSlice = info.slice(info.indexOf('/Root'));
    rootSlice = rootSlice.slice(0, rootSlice.indexOf('/', 1));

    console.log("Este es el segundo rootSlice:")
    console.log(rootSlice)
    var rootRef = rootSlice
        .slice(6)
        .toString()
        .trim(); // /Root + at least one space

    console.log("Este es rootRef:")
    console.log(rootRef)

    var infoSlice = info.slice(info.indexOf('/Info '));
    var infoObject = infoSlice.slice(0, infoSlice.indexOf('/', 1)).toString();



    var root = find_object_1.default(pdf, refTable, rootRef).toString();
    console.log("Este es el root object encontrado:")
    console.log(root)
    console.log("refTable.maxOffset:", refTable.maxOffset)
    console.log("xRefPosition: ", xRefPosition)
    /*
    var isLinearized = pdf.indexOf('/Linearized') != -1
    if(isLinearized){
      var linearizationInfo = pdf.slice(pdf.indexOf('/Linearized'))
      linearizationInfo = linearizationInfo.slice(0, linearizationInfo.indexOf('>>',1))
      xRefPosition = parseInt(linearizationInfo.toString().split('/T ')[1].split('/')[0])+1
    }
    console.log("refTable.maxOffset:", refTable.maxOffset)
    console.log("xRefPosition: ", xRefPosition)
    */
    var isxrefStream = isStream(info)

    //if (refTable.maxOffset > xRefPosition) {
    //    throw new Error('Ref table is not at the end of the document. This document can only be signed in incremental mode.');
    //}
    return {
        xref: refTable,
        rootRef: rootRef,
        root: root,
        previousXrefs: [],
        xRefPosition: xRefPosition,
        isXRefStream: isxrefStream,
        infoObject: infoObject,
    };
};


var readRefTable = function (pdf,xRefPosition) {
    var offsetsMap = new Map();
    var typesMap = new Map();
    console.log("EMPIEZO EL TRABAJO: ESTOY EN READ REF TABLE:")
    console.log("ESTE ES EL PDF:")
    console.log(pdf.toString())

    //var xRefTableInfo = findCompressedXrefTable(pdf, true)
    //var pdfWithoutLastTrailer = pdf.slice(0, xRefTableInfo.trailerStart);
    //var lastXRefTableInfo = findCompressedXrefTable(pdfWithoutLastTrailer,false)
    var fullXrefTable = getFullXrefTable(pdf,xRefPosition);
    console.log("THIS IS THE FULL XREF TABLE: ")
    console.log(fullXrefTable)
    //var mergedXrefTable = __assign(__assign({}, lastXRefTableInfo.xRefContent), xRefTableInfo.xRefContent);
    //var mergedXrefTypeTable = __assign(__assign({}, lastXRefTableInfo.xRefTypeContent), xRefTableInfo.xRefTypeContent);
    //console.log(mergedXrefTypeTable)


    var startingIndex = 0;
    var maxOffset = 0;
    var maxIndex = Object.keys(fullXrefTable.xRefContent).length - 1;
    Object.keys(fullXrefTable.xRefContent).forEach(function (id) {
        var offset = parseInt(fullXrefTable.xRefContent[id]);
        maxOffset = Math.max(maxOffset, offset);
        offsetsMap.set(parseInt(id), offset);
    });


    Object.keys(fullXrefTable.xRefTypeContent).forEach(function (id) {
        var type = fullXrefTable.xRefTypeContent[id];
        console.log("type en objectKeys:", type, "id: ",id)
        typesMap.set(parseInt(id), type);
    });

    return {
        maxOffset: maxOffset,
        startingIndex: startingIndex,
        maxIndex: maxIndex,
        offsets: offsetsMap,
        types: typesMap,
    };
};


var getFullXrefTable = function(pdf, xRefPosition){

    var refTableSlice = pdf.slice(xRefPosition)
    refTableSlice = refTableSlice.slice(0,refTableSlice.indexOf('%%EOF',1))

    var isxrefStream = isStream(refTableSlice)


    if(isxrefStream){
      refTableSlice = refTableSlice.slice(0,refTableSlice.indexOf('\nendstream',1))
      var lastXRefTable = readxrefStream(refTableSlice)
    }else{
      refTableSlice = refTableSlice.slice(0,refTableSlice.indexOf('\nstartxref',1))
      var lastXRefTable = readxref(refTableSlice)
    }

    if(lastXRefTable.prev === undefined && lastXRefTable.XRefStm === undefined ){
      return {
        xRefContent:lastXRefTable.xRefContent,
        xRefTypeContent: lastXRefTable.xRefTypeContent,
      }
    }

    if(lastXRefTable.prev != undefined && lastXRefTable.XRefStm == undefined){
      console.log("ESTOY EN /PREV != undefined && XREFSTM == undefined")
      var partOfXrefTable = getFullXrefTable(pdf,lastXRefTable.prev)
      console.log("ESTA ES PARTOFXREFTABLE")
      console.log(partOfXrefTable)
      console.log("ESTA ES LASTXREFTABLE")
      console.log(lastXRefTable)
      var mergedXrefTable = __assign(__assign({}, partOfXrefTable.xRefContent), lastXRefTable.xRefContent);
      console.log("ESTA ES LA TABLA MERGEADA:")
      console.log(mergedXrefTable)
      var mergedXrefTypeTable = __assign(__assign({}, partOfXrefTable.xRefTypeContent), lastXRefTable.xRefTypeContent);
      console.log("ESTA ES LA TABLA DE TIPOS MERGEADA:")
      console.log(mergedXrefTypeTable)
    }



    if(lastXRefTable.prev == undefined && lastXRefTable.XRefStm != undefined){
      var partOfXrefTableStm = getFullXrefTable(pdf,lastXRefTable.XRefStm)
      var mergedXrefTable = __assign(__assign({}, partOfXrefTableStm.xRefContent), lastXRefTable.xRefContent);
      var mergedXrefTypeTable = __assign(__assign({}, partOfXrefTableStm.xRefTypeContent), lastXRefTable.xRefTypeContent);

    }


    if(lastXRefTable.prev != undefined && lastXRefTable.XRefStm != undefined){
      var partOfXrefTable = getFullXrefTable(pdf,lastXRefTable.prev)
      var mergedXrefTable = __assign(__assign({}, partOfXrefTable.xRefContent), lastXRefTable.xRefContent);
      var mergedXrefTypeTable = __assign(__assign({}, partOfXrefTable.xRefTypeContent), lastXRefTable.xRefTypeContent);

      var partOfXrefTableStm = getFullXrefTable(pdf,lastXRefTable.XRefStm)
      mergedXrefTable = __assign(__assign({}, partOfXrefTableStm.xRefContent), mergedXrefTable);
      mergedXrefTypeTable = __assign(__assign({}, partOfXrefTableStm.xRefTypeContent), mergedXrefTypeTable);

    }

    return {
      xRefContent:mergedXrefTable,
      xRefTypeContent: mergedXrefTypeTable,
    }
}

var isStream = function(refTable){
  var foundTrailer = refTable.indexOf('trailer') != -1
  console.log("foundTrailer: ", foundTrailer)
  var foundTypeXRef = refTable.indexOf('/Type/XRef') != -1

  console.log("foundTypeXRef: ", foundTypeXRef)
  var foundStream = refTable.indexOf('stream') !=-1
  console.log("foundStream: ", foundStream)
  if(foundTrailer && foundStream && foundTypeXRef){
    var isFirstStream = refTable.indexOf('/Type/XRef') < refTable.indexOf('trailer')
    return isFirstStream
  }else if((!foundTrailer) && foundTypeXRef && foundStream){
    return true
  }else{
    return false
  }
}


var readxrefStream = function (refTable){
  console.log("ESTOY EN READ XREF STREAM TABLE:")
  //var trailerStart = pdf.lastIndexOf('/DecodeParms');
  //var trailer = pdf.slice(trailerStart,pdf.length-1);
  //trailer =  trailer.slice(0,trailer.lastIndexOf('%%EOF'))
  //console.log("trailer: ")
  //console.log(trailer.toString())
  var xRefPosition = refTable.slice(refTable.lastIndexOf('startxref') + 10).toString();
  //.split('%%EOF')[0]
  console.log("xRefPosition: ",xRefPosition)
  xRefPosition = parseInt(xRefPosition)
  console.log("parsed xRefPosition:",xRefPosition)

  var size = refTable.toString().split('/Size')[1].split('/')[0];
  console.log("size: ", size)
  size = parseInt(size)

  var widthsString = refTable.toString().split('/W[')[1].split(']')[0].split(' ')
  var k = 0
  var widths = []
  for(var i = 0; i<widthsString.length; i++){
    if(!isNaN(parseInt(widthsString[i]))){
      widths[k] = parseInt(widthsString[i])
      k++
    }
  }
  console.log("widths: ", widths)

  var predictor = refTable.toString().split('/Predictor ')
  if(predictor.length > 1){
    predictor = parseInt(predictor[1].split('/')[0])
  }else{
    predictor = 0
  }
  console.log("predictor: ", predictor)
  var index = refTable.toString().split('/Index[')

  console.log("index: ", index)
  if(index.length > 1){
    index = index[1].split(']')[0].split(' ')
    index[0] = parseInt(index[0])
    index[1] = parseInt(index[1])
    console.log("parsed index: ", index)
  }else{
    index = [0, size]
  }


  var startStream = refTable.lastIndexOf('stream')
  console.log("From startStream: ", refTable.slice(startStream).toString())
    var stream = refTable.slice(startStream+8)

  console.log("raw stream: ")
  console.log(stream)

  console.log("stream to String: ")
  console.log(stream.toString())
  //var resultAsBinString  = pako.inflate(stream, { to: 'string' });

  var resultAsBinString  = pako.inflate(stream);
  console.log("decompressed raw stream:")
  console.log(resultAsBinString)

  //console.log("decompressed hex stream:")
  //console.log(Buffer.from(resultAsBinString).toString('hex'))
  if( predictor == 12){
    var unfilteredstream = pngUpFilterDecoder(resultAsBinString,widths)
  }else{
    var unfilteredstream = resultAsBinString
  }

  console.log("unfilered hex stream:")
  console.log(Buffer.from(unfilteredstream).toString('hex'))

  var fakeXrefTable = createFakeXRefTable(Buffer.from(unfilteredstream).toString('hex'), index, 2*widths[0],2*widths[1],2*widths[2])
  console.log("fakeXrefTable.split(\n): ")
  console.log(fakeXrefTable.split('\n'))
  console.log("fakeXrefTable.split('\n').filter(function (l) { return l !== ''; }): ")
  console.log(fakeXrefTable.split('\n').filter(function (l) { return l !== ''; }))


  var isContainingPrev = refTable.toString().split('/Prev')[1] != null;
  var isContainingXRefStm = refTable.toString().split('/XRefStm')[1] != null;

  if(isContainingPrev){
    var prevByteOffset = parseInt(refTable.toString().split('/Prev ')[1].split('/')[0])
  }else{
    var prevByteOffset = undefined
  }


  if(isContainingXRefStm){
    var xrefStmByteOffset = parseInt(refTable.toString().split('/XRefStm ')[1].split('/')[0])
  }else{
    var xrefStmByteOffset = undefined
  }

  if(!isContainingPrev && !isContainingXRefStm){

    var xRefContent = fakeXrefTable
        .split('\n')
        .filter(function (l) { return l !== ''; })
        .reduce(parseXref, {});
    console.log("xRefContent: ")
    console.log(xRefContent)

    var typeContent = fakeXrefTable
        .split('\n')
        .filter(function (l){return l !== ''; })
        .reduce(parseTypeXref,{})
    console.log("typeContent: ")
    console.log(typeContent)

  }else{
    var xRefContent = fakeXrefTable
        .split('\n')
        .filter(function (l) { return l !== ''; })
        .reduce(parseXref, {});
        console.log("xRefContent: ")
        console.log(xRefContent)
    var typeContent = fakeXrefTable
        .split('\n')
        .filter(function (l){return l !== ''; })
        .reduce(parseTypeXref,{})
        console.log("typeContent: ")
        console.log(typeContent)

  }

  console.log("return: size =", size, "RefContent = ", xRefContent)
  return {
    size: size,
    prev: prevByteOffset,
    XRefStm: xrefStmByteOffset,
    xRefContent: xRefContent,
    xRefTypeContent: typeContent,
  };

}

var createFakeXRefTable = function(hexStream, objectRange, typeBytes, offsetBytes, generationNumberBytes){
  var fakeXrefTable = ''
  var realSize = 0
  var streamOffsets = []
  var step = (typeBytes + offsetBytes + generationNumberBytes)
  console.log("step: ", step)
  console.log("hexStream.length: ", hexStream.length)
  for(var i=0; i<hexStream.length;i=i+step){
    console.log("i: ", i)
    console.log("type points : i",i, "i2: ", i+typeBytes)
    console.log("type hex: ", parseInt(hexStream.slice(i,i+typeBytes),16))
    var type = parseInt(hexStream.slice(i,i+typeBytes),16).toString()
    console.log("type:", type)
    console.log("offset points : i",i+typeBytes, "i2: ", i+typeBytes+offsetBytes)
    console.log("offset hex: ", hexStream.slice(i+typeBytes,i+typeBytes+offsetBytes),16)
    var offset = parseInt(hexStream.slice(i+typeBytes,i+typeBytes+offsetBytes),16).toString()

    var N = 10-offset.length
    for(var k= 0; k<N; k++){offset = "".concat('0',offset)}
    console.log("offset:", offset)
    console.log("genNumber points : i",i+typeBytes+offsetBytes, "i2: ", i+typeBytes+offsetBytes+generationNumberBytes)
    console.log("type hex: ", hexStream.slice(i+typeBytes+offsetBytes,i+typeBytes+offsetBytes+generationNumberBytes),16)
    var genNumber = parseInt(hexStream.slice(i+typeBytes+offsetBytes,i+typeBytes+offsetBytes+generationNumberBytes),16).toString()
    var N = 5-genNumber.length
    for(var k= 0; k<N; k++){genNumber ="".concat('0',genNumber)}
    console.log("genNumber:", genNumber)

    if(type === '0') {
      type = 'f';
      if(offset === '0000000000'){
        genNumber = '65535'
      }
    } else if(type === '1'){
      type='n'
    }else{
      type = 'c'
    }
    //if(type != 'c'){
    //  streamOffsets[realSize] = offset
    //  realSize++
      fakeXrefTable = "".concat(fakeXrefTable,offset,' ',genNumber, ' ', type , '\r\n')
    //}else{
    //  fakeXrefTable = "".concat(fakeXrefTable,offset,' ',genNumber, ' ', type , '\r\n')

    //}
  }
  fakeXrefTable = ''.concat(objectRange[0].toString(),' ',objectRange[1].toString(), '\r\n' , fakeXrefTable)

  console.log("fakeXrefTable: ")
  console.log( fakeXrefTable)
  return fakeXrefTable
}






var pngUpFilterDecoder = function(stream, widths, predictor){
  var rowLength = widths[0]+widths[1]+widths[2]+1,
      fila= 0,
      columna = 0,
      k = 0,
      unfilteredstream = new Uint8Array(stream.length-Math.ceil(stream.length/rowLength))

  for(var i = 0; i<stream.length; i++){
    if(columna == 0 ){ var isPngFiltered = stream[i] == 2}
    console.log("isPngFiltered?: ", isPngFiltered)
    if((fila === 0 && columna != 0) || (!isPngFiltered && columna != 0)){
      //console.log("Estoy en file = 0, columna != 0")
      unfilteredstream[k] = stream[i]
      console.log("He entrado al primer if")
      console.log("unfilteredstream: ", unfilteredstream[i])
      //console.log("unfilteredstream[k] = ", unfilteredstream[k])
      k++
    }else if (columna != 0 ){
      //console.log("Estoy en columna != 0")
      //console.log("fila: ", fila, "columna: ", columna, "i: ", i , "k: ",k)
      var upperByte = unfilteredstream[(fila-1)*(rowLength-1)+columna-1]
      var actualByte = stream[i]
      //console.log("upperByte: ", upperByte)
      //console.log("actualByte: ", actualByte)
      if(actualByte + upperByte > 256){
        var unfilteredByte = (actualByte + upperByte)%256
        //console.log("unfiltered")
      }else{
        var unfilteredByte = actualByte + upperByte
      }
      unfilteredstream[k] = unfilteredByte

      console.log("He entrado al else if")
      console.log("unfilteredstream: ", unfilteredstream[k])
      //console.log("unfilteredstream[k] = ", unfilteredstream[k])
      k++
    }

    if(((i+1) % rowLength) === 0){
      fila +=1
      columna = 0
    }else{
      columna +=1
    }

  }
  //console.log("unfilteredstream:")
  //console.log(unfilteredstream)
  return unfilteredstream
}

/*
var getFullXrefTable = function (pdf) {
  console.log("IM AT GET FULL XREF TABLE:")
    var lastTrailerPosition = getLastTrailerPosition(pdf);

    console.log("lastTrailerPosition: ",lastTrailerPosition)
    var lastXrefTable = getXref(pdf, lastTrailerPosition);
    console.log("lastXrefTable: ",lastXrefTable)
    console.log("lastXrefTable.prev: ",lastXrefTable.prev)
    if (lastXrefTable.prev === undefined) {
      console.log("lastXrefTable.xRefContent: ",lastXrefTable.xRefContent)
        return lastXrefTable.xRefContent;
    }

    var pdfWithoutLastTrailer = pdf.slice(0, lastTrailerPosition);
    console.log("pdfWithoutLastTrailer:")
    console.log(pdfWithoutLastTrailer)
    console.log("ENTRO EN BUCLE HASTA QUE NO HAYA MÁS TRAILERS")
    var partOfXrefTable = getFullXrefTable(pdfWithoutLastTrailer);
    var mergedXrefTable = __assign(__assign({}, partOfXrefTable), lastXrefTable.xRefContent);
    console.log("mergedXrefTable:")
    console.log(mergedXrefTable.toString())
    console.log("SALGO DE GET FULL XREF TABLE")
    return mergedXrefTable;
};
var getLastTrailerPosition = function (pdf) {
    console.log("IM AT GET LAST TRAILER POSITION:")
    console.log("pdf: ")
    console.log(pdf)
    var trailerStart = pdf.lastIndexOf('trailer');
    console.log("pdf[trailerStart+1].toString(): ", pdf[trailerStart+1].toString())
    console.log("trailerStart: ",trailerStart)
    console.log("pdf.length-6 = ",pdf.length-6 )
    var trailer = pdf.slice(trailerStart, pdf.length - 6);
    console.log("trailer: ",trailer.toString())
    var xRefPosition = trailer.slice(trailer.lastIndexOf('startxref') + 10).toString();
    console.log("xRefPosition: ",xRefPosition)
    return parseInt(xRefPosition);
};
*/
var readxref = function (refTable) {
    console.log("IM AT READXREF:")

    console.log("refTable: ")
    console.log(refTable.toString())
    refTable = refTable.slice(4);
    console.log("refTable.slice(4): ")
    console.log(refTable.toString())
    refTable = refTable.slice(refTable.indexOf('\n') + 1);
    console.log("refTable=refTable.slice(refTable.indexOf('\n') + 1): ")
    console.log(refTable.toString())
    var size = refTable.toString().split('/Size')[1];
    console.log("size = refTable.toString().split('/Size')[1]: ")
    console.log(size.toString())
    var _a = refTable.toString().split('trailer'), objects = _a[0], infos = _a[1];
    console.log("_a= refTable.toString().split('trailer'):")
    console.log(_a)
    console.log("objects = _a[0]: ")
    console.log(_a[0])
    console.log("infos = _a[1]:")
    console.log(_a[1])
    var isContainingPrev = infos.split('/Prev ')[1] != null;
    var isContainingXRefStm = infos.split('/XRefStm ')[1] != null;
    console.log("isContainingPrev:",isContainingPrev)

    if(isContainingPrev){
      var prevByteOffset = parseInt(infos.split('/Prev ')[1].split('/')[0])
    }else{
      var prevByteOffset = undefined
    }


    if(isContainingXRefStm){
      var xrefStmByteOffset = parseInt(infos.split('/XRefStm ')[1].split('/')[0])
    }else{
      var xrefStmByteOffset = undefined
    }

    var xRefContent;
    if (isContainingPrev || isContainingXRefStm) {

        xRefContent = objects
            .split('\n')
            .filter(function (l) { return l !== ''; })
            .reduce(parseXref, {});
       console.log("xRefContent = objects.split(n).filter(function (l) { return l !== ''; }).reduce(parseTrailerXref, {}): ")
       console.log(xRefContent)

       var typeContent = objects
           .split('\n')
           .filter(function (l){return l !== ''; })
           .reduce(parseTypeXref,{})
      console.log("typeContent: ")
      console.log(typeContent)
    }
    else {
        xRefContent = objects
            .split('\n')
            .filter(function (l) { return l !== ''; })
            .reduce(parseXref, {});
        console.log("xRefContent = objects.split(n).filter(function (l) { return l !== ''; }).reduce(parseRootXref, {}): ")
        console.log(xRefContent)

        var typeContent = objects
            .split('\n')
            .filter(function (l){return l !== ''; })
            .reduce(parseTypeXref,{})
            console.log("typeContent: ")
            console.log(typeContent)
    }

    console.log("return: size =", size, "prev= ", prevByteOffset, "RefContent = ", xRefContent)
    return {
        size: size,
        prev: prevByteOffset,
        XRefStm: xrefStmByteOffset,
        xRefContent: xRefContent,
        xRefTypeContent: typeContent,
    };
};

var parseXref = function(prev, curr, _index, array){
  console.log("ESTOY EN PARSE XREF:")
  console.log("prev: ")
  console.log(prev)
  console.log("curr:")
  console.log(curr)
  console.log("_index:")
  console.log(_index)
  console.log("array: ")
  console.log(array)
  if(array.length === 1){
    console.log("He entrado en array.length === 1")
    console.log("return {}")
    return {}
  }
  const isObjectId = curr.split(' ').length === 2
  if(isObjectId){
    console.log("Is object ID.")
    const id=curr.split(' ')[0]
    console.log("id: ")
    console.log(id)
    console.log("return: ")
    console.log({...prev,[id]:undefined})
    return {...prev,[id]:undefined}
  }
  console.log("No es Object ID.")
  console.log("curr array: ",curr.split(' '))
  console.log("offset: ",curr.split(' ')[0])
  const offset = curr.split(' ')[0]
  var prevId = Object.keys(prev).find(id => prev[id] === undefined)
  console.log("prevId: ",prevId)
  if(prevId === undefined){
    prevId = Object.keys(prev)[Object.keys(prev).length-1]
    prevId = (parseInt(prevId)+1).toString()
    console.log("This is the prevId obtained as the last prev key:")
    console.log("prevId: ", prevId)

  }
  console.log("return: ")
  console.log({...prev,[prevId]:parseInt(offset)})
  return {...prev,[prevId]:parseInt(offset)}
  }



  var parseTypeXref = function(prev,curr,_index, array){
    if(array.length === 1){
      return {}
    }
    const isObjectId = curr.split(' ').length === 2
    if(isObjectId){
      const id=curr.split(' ')[0]
      return {...prev,[id]:undefined}
    }
    const type = curr.split(' ')[2]
    var prevId = Object.keys(prev).find(id => prev[id] === undefined)
    if(prevId === undefined){
      prevId = Object.keys(prev)[Object.keys(prev).length-1]
      prevId = (parseInt(prevId)+1).toString()
      console.log("This is the prevId type obtained as the last prev key:")
      console.log("prevId: ", prevId)
    }
    return {...prev,[prevId]:type}
  }

exports.default = readPdf;
