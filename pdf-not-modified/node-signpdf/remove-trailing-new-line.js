"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var removeTrailingNewLine = function (pdf) {
    console.log("ESTOY EN REMOVE TRAILING NEW LINE")
    if (!(pdf instanceof Buffer)) {
        throw new Error('PDF expected as Buffer.');
    }
    var lastChar = pdf.slice(pdf.length - 1).toString();
    console.log("Este es el lastChar:")
    console.log('p'+lastChar+'p')
    var output = pdf;
    if (lastChar === '\n') {
        console.log("He quitado el salto de línea")
        output = pdf.slice(0, pdf.length - 1);
    }
    var lastChar = output.slice(output.length - 1).toString();
    console.log("Este es el lastChar:")
    console.log(lastChar)
    if (lastChar === ' ' || lastChar === '\n' || lastChar === '\r') {
        console.log("He quitado el espacio/salto de línea")
        output = output.slice(0, output.length - 1);
    }
    var lastLine = output.slice(output.length - 6).toString();
    console.log("Esta es la ultima linea:")
    console.log(lastLine)
    if (lastLine !== '\n%%EOF') {
        console.log("He añadido %%EOF al pdf")
        output = Buffer.concat([output, Buffer.from('\n%%EOF')]);
    }
    return output;
};
exports.default = removeTrailingNewLine;
