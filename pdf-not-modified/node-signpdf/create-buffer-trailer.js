"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createBufferTrailer = function (pdf, info, addedReferences) {
    var rows = [];
    rows[0] = '0000000000 65535 f ';
    addedReferences.forEach(function (offset, index) {
        var paddedOffset = ("0000000000" + offset).slice(-10);
        rows[index + 1] = index + " 1\n" + paddedOffset + " 00000 n ";
    });
    rows = rows.filter(function (row) { return row !== undefined; });

    var trailer = Buffer.concat([
        Buffer.from('xref\n'),
        Buffer.from(info.xref.startingIndex + " 1\n"),
        Buffer.from(rows.join('\n')),
        Buffer.from('\ntrailer\n'),
        Buffer.from('<<\n'),
        Buffer.from("/Size " + (info.xref.maxIndex + 1) + "\n"),
      ])

      if(!info.isXRefStream){
        trailer = Buffer.concat([trailer, Buffer.from("/Prev " + info.xRefPosition + "\n"),])
      }else{
        trailer = Buffer.concat([trailer, Buffer.from("/XRefStm " + info.xRefPosition + "\n"),])
      }


    trailer =  Buffer.concat([
      trailer,
      Buffer.from("/Root " + info.rootRef + "\n"),
      Buffer.from( info.infoObject +"\n"),
      Buffer.from('>>\n'),
      Buffer.from('startxref\n'),
      Buffer.from(pdf.length + "\n"),
      Buffer.from('%%EOF'),
    ])


    return trailer;
};
exports.default = createBufferTrailer;
