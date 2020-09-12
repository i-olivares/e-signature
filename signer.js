var signer = require('pdf-signer')
const helpers = require('node-signpdf/dist/helpers')

window.signPDF = async function(pdfArrayBuffer,pdfInfoBytes,certArrayBuffer,imageArrayBuffer, width){
            var certBuffer = toBuffer(certArrayBuffer)
            var pdfBuffer = toBuffer(pdfArrayBuffer)
            var imageBuffer = toBuffer(imageArrayBuffer)


            //var name = document.getElementById("usrname").value + ' ' + document.getElementById("family").value;
            var name = ''
            var [x0,y0,canvas_scale, current_page] = getCoordsAndScale()

            if( (typeof x0) != 'number' || (typeof y0) != 'number'){
              x0 = 100*canvas_scale
              y0=600*canvas_scale
            }
            //const height = 45
            //const width = 120

            const titleRefWidth = 120
            const dateRefWidth = 120
            if(width){
              var height = 45,
                  titleFont = 12,
                  dateFont = 9,
                  yPosTitle = height,
                  yPosDate = 10,
                  yPosImage = 20,
                  imageSpace = 100,
                  imageStrech = 15,
                  title = 'BioSigned by: ';

            }else{

              var height = 60,
                  width = 120,
                  titleFont = 10,
                  dateFont = 8,
                  yPosTitle = height-20,
                  yPosDate = 10,
                  imageSpace = 200,
                  imageStrech = 30,
                  yPosImage = 20,
                  title = 'BioSigned by: ';
            }


            console.log("width/titleRefWidth: ",titleRefWidth/width)
            console.log("width/dateRefWidth: ",dateRefWidth/width)


            //var today = displayDate()

            var attributes = {
                reason: '2',
                email: '',
                location: 'Location',
                signerName: name,
                shouldAnnotationAppearOnFirstPage: current_page - 1,
                annotationAppearanceOptions: {
                  signatureCoordinates: { left: x0/canvas_scale, bottom: 860 - y0/canvas_scale, right: x0/canvas_scale+width, top: 860 - y0/canvas_scale-height },
                  signatureDetails: [
                    {
                      value: title,
                      fontSize: titleFont,
                      transformOptions: { rotate: 0, space: titleRefWidth/width, tilt: 0, xPos: 5, yPos: yPosTitle },
                    },
                    {
                      value:  _USERID,
                      fontSize: dateFont,
                      transformOptions: { rotate: 0, space: dateRefWidth/width, tilt: 0, xPos: 25, yPos: yPosDate },
                    },
                  ],
                  imageDetails: {
                    imagePath: imageBuffer,
                    transformOptions: { rotate: 0, space: imageSpace, stretch: imageStrech, tilt: 0, xPos: 25, yPos: yPosImage },
                  },
                },
              }

            var signedPDF = await signer.sign(pdfBuffer,certBuffer,'password',attributes)
            var pdfArrayBuffer = toArrayBuffer(signedPDF)
            var pdfInfoArrayBuffer = toArrayBuffer(pdfInfoBytes)
            document.getElementById("loader").style.display = "none";
            document.getElementById("loaderText").style.display = "none";
            closemodal()
            document.getElementById("downloadSignedPdf").style.display = "block";
            console.log("ESTOY EN signPDF y he actualizado _PDFCONTENTS = pdfArrayBuffer")
            _PDFCONTENTS = pdfArrayBuffer
            _SIGNATURECOUNTER += 1
            reRender(pdfArrayBuffer)
            var zip = new JSZip();
            zip.file("signed-document.pdf", pdfArrayBuffer);
            zip.file("cert.pdf", pdfInfoArrayBuffer);
            jQuery("#downloadSignedPdf").on("click", function () {
              zip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
                blobToDownload('signature-information.zip', blob, 'downloadSignedPdf')                          // 2) trigger the download
              }, function (err) {
                jQuery("#downloadSignedPdf").text(err);
              });
            });
            //blobToDownload('signature-information.zip', blob, 'downloadInfoPdf')
            //saveByteArray('signed-document.pdf', pdfArrayBuffer, 'downloadSignedPdf')
            //saveByteArray('signature-information.pdf', pdfInfoArrayBuffer, 'downloadInfoPdf')
}

function toBuffer(ab) {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

function saveByteArray(reportName, byte,  element) {
    var blob = new Blob([byte], {type: "application/pdf"});
    var queryElement = '#'+ element
    var link = document.getElementById(element);
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
};



function blobToDownload(reportName, blob,  element) {
    var queryElement = '#'+ element
    var link = document.getElementById(element);
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
};


function getDate(){
  var today = new Date();
  var dd = today.getDate();

  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd<10)
  {
    dd='0'+dd;
  }

  if(mm<10)
  {
    mm='0'+mm;
  }
  var utcTime = getUTCTime()
return dd+'/'+mm+'/'+yyyy +" " + utcTime
}



function getUTCTime() {
  var d = new Date();
  var h = addZero(d.getUTCHours());
  var m = addZero(d.getUTCMinutes());
  var s = addZero(d.getUTCSeconds());
  return h + ":" + m + ":" + s;
}

function addZero(i) {
if (i < 10) {
  i = "0" + i;
}
return i;
}
