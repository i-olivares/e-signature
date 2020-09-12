function readImage(){
  var inputSignature = document.getElementById('image').files[0];
  var imageReader = new FileReader();
  imageReader.onload = async function(event){
      imageArrayBuffer = imageReader.result;
      console.log("imageArrayBuffer: ")
      console.log(imageArrayBuffer)
      var pdfInfoBytes = await createPDFwithSignatureInfo()
      readDocument(pdfInfoBytes,imageArrayBuffer)
    }
    imageReader.readAsArrayBuffer(inputSignature);

}


function readImageFromPDF(){
  var inputSignature = document.getElementById('image').files[0];
  var imageReader = new FileReader();
  console.log("Estoy en readImageFromPDF()")
  imageReader.onload = async function(event){
    console.log("Estoy en readImageFromPDF() dentro del reader")
    contents = imageReader.result;
    //pdfjsLib.getDocument(contents)

    pdfjsLib.getDocument({data: contents, nativeImageDecoderSupport: 'none'}).promise.then(function (doc) {
      doc.getPage(1).then(function (page) {
        console.log("Voy a coger una página")
        console.log("page: ", page)
        console.log("page.objs: ", page.objs)
        console.log("page.objs._objs: ", page.objs._objs)
        page.getOperatorList().then(async function (ops) {
          window.objs = []
          for (var i=0; i < ops.fnArray.length; i++) {
            if (ops.fnArray[i] == pdfjsLib.OPS.paintImageXObject) {

              var image = page.objs.get(ops.argsArray[i][0])
              var rgbaImage = resizeImageData(image.data)


              var renderer = document.getElementById('canvas-renderer');
              renderer.width = image.width;
              renderer.height = image.height;
              var palette = renderer.getContext('2d').getImageData(0,0,image.width,image.height)
              palette.data.set(rgbaImage);
              renderer.getContext('2d').putImageData(palette,0,0);

              var canvas = document.getElementById("pdf-image");
              var ctx = canvas.getContext('2d');
              //ctx.fillStyle = '#fff';
              //ctx.fillRect(0,0,canvas.width,canvas.height)
              ctx.drawImage(renderer, 0,0, 400, 100);


              var dataUrl = canvas.toDataURL();
              var blobImage = dataURItoBlob(dataUrl)
              var imageArrayBuffer = await blobImage.arrayBuffer()
              var pdfInfoBytes = await createPDFwithSignatureInfo()
              readDocument(pdfInfoBytes,imageArrayBuffer)
            }
          }
        })


      })
    })

  }
  imageReader.readAsArrayBuffer(inputSignature);

}


function readDocument(pdfInfoBytes,imageArrayBuffer, width) {
    console.log("IM AT READ DOCUMENT")
    var fileReader = new FileReader();
    var file = document.getElementById('sign').files[0];

    if(_PDFCONTENTS == null){
      console.log("_PDFCONTENTS IS NULL")
      fileReader.onload = async function(fileLoadedEvent) {
        var contents = fileReader.result;

        var certArrayBuffer = createCertificate(contents,imageArrayBuffer)
        if(width){
          signPDF(contents,pdfInfoBytes,certArrayBuffer,imageArrayBuffer,width)
        }else{
          signPDF(contents,pdfInfoBytes,certArrayBuffer,imageArrayBuffer)
        }
      }
      fileReader.readAsArrayBuffer(file)
    }else{
      console.log("_PDFCONTENTS IS NOT NULL")
      var certArrayBuffer = createCertificate(_PDFCONTENTS,imageArrayBuffer)
      if(width){
        signPDF(_PDFCONTENTS,pdfInfoBytes,certArrayBuffer,imageArrayBuffer,width)
      }else{
        signPDF(_PDFCONTENTS,pdfInfoBytes,certArrayBuffer,imageArrayBuffer)
      }
    }
}


function closemodal(){
  document.getElementById("myModal-loader").style.display = "none";
}
