
async function createPDFwithSignatureInfo(){
  console.log("ESTOY EN CREATEPDFWITHSIGNATUREINFO")
  console.log("_SIGNATURECOUNTER: ",_SIGNATURECOUNTER)
  //console.log("imageArrayBuffer:")
  //console.log(imageArrayBuffer)

  const url = 'https://static.wixstatic.com/media/a99eaa_cdc76beb4a6c4895b2202828eda746e3~mv2.png'
  const imageBytes = await fetch(url).then(res => res.arrayBuffer())




  if( _PDFINFO == null){
    console.log("HE ENTRADO A _PDFINFO == null")
    console.log("_SIGNATURECOUNTER: ", _SIGNATURECOUNTER)
    var pdfDoc = await PDFDocument.create()

    //envelopeText = "Document ID: " + envelopeID
    //console.log("envelopeText: ", envelopeText)
  }else{
    console.log("HE ENTRADO A _PDFINFO != null")
    var pdfDoc = await PDFDocument.create()
    const donorPdfDoc = await PDFDocument.load(_PDFINFO)
    var numpages = donorPdfDoc.getPages().length
    for (var i=0;i<numpages;i++){
      var [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [i])
      var page = pdfDoc.addPage(donorPage)
    }
  }

  var numpages = pdfDoc.getPages().length

  if(_SIGNATURECOUNTER == 4 && numpages == 1){
    _SIGNATURECOUNTER = 0
  }else if(_SIGNATURECOUNTER == 8 && numpages > 1){
    _SIGNATURECOUNTER = 0
  }


  var s0 = 0
  if(_SIGNATURECOUNTER < 1 && numpages == 0){
    var page = pdfDoc.addPage()
    console.log("This is the first pdf page:")
    console.log(page)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const pngImageSign = await pdfDoc.embedPng(imageBytes)
    //const pngSignature = await _PDFINFO.embedPng(imageArrayBuffer)
    addHeader(helveticaFont,helveticaBoldFont, page, pngImageSign)

  }else if(_SIGNATURECOUNTER < 1 ){
    var page = pdfDoc.addPage()
  }

  var numpages = pdfDoc.getPages().length
  if(numpages > 1){
    var s0 = -300
  }
  const space = s0+_SIGNATURECOUNTER*80
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  //console.log("numpages: ", numpages)
  //var pages = pdfDoc.getPages()
  //var page = pages[numpages-1]
  console.log("this is the last page:")
  console.log(page)
  addSignature(helveticaFont,helveticaBoldFont, page,space)
  _PDFINFO = await pdfDoc.save()
  const pdfBytes = await pdfDoc.save()
  return pdfBytes

}

function addHeader(helveticaFont,helveticaBoldFont, page,pngImageSign){
  const width = 595.28
  const height = 841.89
  const fontSize = 10
  const imageHeight = 50
  const imageWidth = 100
  const envelopeID = ID()

  page.drawImage(pngImageSign, {
    x: width-155,
    y: height-150,
    width: imageWidth,
    height: imageHeight,
  })
  var bioSignText = "BioSign.co" + "\n110 Wall Street, NY" +"\nTel: 929-352-5939"
  page.drawText(bioSignText, {
    x: width-130,
    y: height-150,
    maxWidth: width-70,
    lineHeight: 1.5*fontSize,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
    });
  page.drawRectangle({
    x: 65,
    y: height-250,
    width: width-120,
    height: 1.7*fontSize,
    color: rgb(0.3 , 0.7 , 0.5),
    borderColor: rgb(1 , 1 , 1),
    borderWidth: 1.3,
    opacity: 0.3,
    })
  page.drawText("Audit Trail", {
    x: 70,
    y: height-245,
    maxWidth: width-200,
    lineHeight: 1.5*fontSize,
    size: fontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  });
  const header = "Document ID: \nFile name: \nStatus:"
  page.drawText(header, {
    x: 70,
    y: height-265,
    maxWidth: width-100,
    lineHeight: 1.3*fontSize,
    size: fontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
    });
  const filename = document.getElementById('sign').files[0].name;
  const headerText = envelopeID + "\n" + filename + "\nCOMPLETED"
  page.drawText(headerText, {
    x: 210,
    y: height-265,
    maxWidth: width-100,
    lineHeight: 1.3*fontSize,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
    });

  page.drawLine({
    start: { x: 70, y: height-300 },
    end: { x: width-60, y: height-300 },
    thickness: 1,
    color: rgb(0, 0, 0),
    opacity: 0.15,
  })

  page.drawText("UPLOADED",{
    x: 70,
    y: height-320,
    maxWidth: width-200,
    lineHeight: 1.5*fontSize,
    size: fontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  })
  let geolocationInfo = getGeolocationInfo()
  const timeInfo = getDate() + "\n"+getUTCTime()+ "UTC"+"\n" + geolocationInfo.time_zone
  page.drawText(timeInfo,{
    x: 70,
    y: height-335,
    maxWidth: width-200,
    lineHeight: 1.5*fontSize,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  })
  const uploadedText = getUploadedInfo()
  page.drawText(uploadedText,{
    x: 210,
    y: height-320,
    maxWidth: width-200,
    lineHeight: 1.5*fontSize,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  })
}


function addSignature(helveticaFont, helveticaBoldFont,page,space){
  console.log("HE AÑADIDO LA FIRMA")
  const fontSize = 10
  const width = 595.28
  const height = 841.89
  const imageHeight = 50
  const imageWidth = 100

  page.drawText("SIGNED",{
    x: 70,
    y: height-space-400,
    maxWidth: width-200,
    lineHeight: 1.5*fontSize,
    size: fontSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  })
  let geolocationInfo = getGeolocationInfo()
  const timeInfo = getDate() + "\n"+getUTCTime()+ "UTC"+"\n" + geolocationInfo.time_zone
  page.drawText(timeInfo,{
    x: 70,
    y: height-space-415,
    maxWidth: width-200,
    lineHeight: 1.5*fontSize,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    rotate: degrees(0),
  })
  var signatureInfo = getSignatureInfo()
  page.drawText(signatureInfo, {
      x: 210,
      y: height-space-400,
      maxWidth: width-200,
      lineHeight: 1.5*fontSize,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      rotate: degrees(0),
    });
  /*page.drawImage(pngSignature, {
      x: 130,
      y: height-space-460,
      width: 50,
      height: 20,
    })*/
}




function getSignatureInfo(){
  let name = _USERNAME
  let geolocationInfo = getGeolocationInfo()
  let email = _EMAIL
  _USERID = ID()
  let text = "Signed by " + name + "\nIP: "  + geolocationInfo.ip + "\n" + email+ "\nUser ID: " + _USERID;
  //+ "\nSignature: ";
  return text
}

function getUploadedInfo(){
  let name = _USERNAME
  let geolocationInfo = getGeolocationInfo()
  let email = _EMAIL

  _USERID = ID()
  let text = "Uploaded by " + name + "\nIP: "  + geolocationInfo.ip + "\n" + email+ "\nUser ID: " + _USERID;
  //+ "\nSignature: ";
  return text
}

function ID(){
  return Math.random().toString(16).slice(2).toUpperCase();
}


function getGeolocationInfo(){
  _ipgeolocation.enableSessionStorage(true);

    var ip = sessionStorage.getItem("ip");
    var time_zone = sessionStorage.getItem("time_zone");
    var date = ""
    //var date = sessionStorage.getItem("time_zone");

    if (!ip || !time_zone || !date) {
        _ipgeolocation.makeAsyncCallsToAPI(false);
        _ipgeolocation.setFields("time_zone");
        _ipgeolocation.getGeolocation(handleResponse, "5e142114d94240499b36db70e624930d");
    }

    function handleResponse(json) {
        ip = json.ip;
        time_zone = json.time_zone.name;
        date = json.time_zone.current_time;
        date = date.split(".")[0]
    }
    return {
      ip: ip,
      time_zone: time_zone,
      date: date
    }
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
return dd+'/'+mm+'/'+yyyy +" "
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
