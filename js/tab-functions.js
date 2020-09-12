function drawSignature() {
   window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimaitonFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var canvas = document.getElementById("signature-canvas");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#c0392b";
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.lineWidth = 2;

    var drawing = false;
    var mousePos = {
        x: 0,
        y: 0
    };
    var lastPos = mousePos;

    canvas.addEventListener("mousedown", function(e) {
        drawing = true;
        lastPos = getMousePos(canvas, e);
    }, false);

    canvas.addEventListener("mouseup", function(e) {
        drawing = false;
    }, false);

    canvas.addEventListener("mousemove", function(e) {
        mousePos = getMousePos(canvas, e);
    }, false);

    // Add touch event support for mobile
    canvas.addEventListener("touchstart", function(e) {

    }, false);

    canvas.addEventListener("touchmove", function(e) {
        var touch = e.touches[0];
        var me = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(me);
    }, false);

    canvas.addEventListener("touchstart", function(e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var me = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(me);
    }, false);

    canvas.addEventListener("touchend", function(e) {
        var me = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(me);
    }, false);

    function getMousePos(canvasDom, mouseEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        }
    }

    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        }
    }

    function renderCanvas() {
        if (drawing) {
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#c0392b';
            ctx.fillStyle = '#fff';
            ctx.fillRect(0,0,canvas.width,canvas.height)
            ctx.stroke();
            lastPos = mousePos;
        }
    }

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function(e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function(e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function(e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);

    (function drawLoop() {
        requestAnimFrame(drawLoop);
        renderCanvas();
    })();

    function clearCanvas() {
        canvas.width = canvas.width;
    }

    // Set up the UI
    var clearBtn = document.getElementById("sig-clearBtn");

    clearBtn.addEventListener("click", function(e) {
        clearCanvas();
    }, false);


}
var dataUrls = [];
var widths = [];

function readAndSetText(){
  const buttonWidth = 110
  var text = document.getElementById('usrname').value
  if(text == ''){text=' ';}

  for (var i = 0; i<6;i++){
    var tCtx = document.getElementById('textCanvas'+i).getContext('2d')
    var rCtx = document.getElementById('realCanvas'+i).getContext('2d')
    var imageElem = document.getElementById('imageText'+i)


    rCtx.canvas.width = rCtx.measureText(text).width
    //console.log("text width: ", rCtx.canvas.width)
    if(tCtx.measureText(text).width < buttonWidth){
      var safeWidthText = text
      tCtx.canvas.width = tCtx.measureText(text).width

    }else{
      for (var k=0;k<(text.length-1);k++){
        //console.log("buttonWidth: ",buttonWidth)
        //console.log("tCtx.measureText(text.substr(0,k)).width: ", tCtx.measureText(text.substr(0,k)).width)
        if(tCtx.measureText(text.substr(0,k)).width < buttonWidth){
          //console.log("text.substr(0,k): ", text.substr(0,k))
          var safeWidthText = text.substr(0,k)
        }
      }
      tCtx.canvas.width = tCtx.measureText(safeWidthText).width
      safeWidthText = safeWidthText.substr(0,safeWidthText.length-3) +'...'

    }


    switch(i){
      case 0:
        console.log("Estoy en case 0:")
        tCtx.font = "20px Yellowtail"
        rCtx.font = "20px Yellowtail"
        break;

      case 1:
        tCtx.font = "20px Amatic SC"
        rCtx.font = "20px Amatic SC"
        break;

      case 2:
        tCtx.font = "22px Kristi"
        rCtx.font = "22px Kristi"
        break;

      case 3:
        tCtx.font = "20px Dancing Script"
        rCtx.font = "20px Dancing Script"
        break;

      case 4:
        tCtx.font = "22px Italianno"
        rCtx.font = "22px Italianno"
        break;

      case 5:
        tCtx.font = "20px Shadows Into Light"
        rCtx.font = "20px Shadows Into Light"
        break;

      default:
        tCtx.font = "20px Tangerine"
        rCtx.font = "20px Tangerine"
        break;
    }
    //console.log("i: ",i)
    //console.log("Este es el safeWidthText: ", safeWidthText)


    tCtx.fillText(safeWidthText, 0, 15)

    //store the current globalCompositeOperation
		var compositeOperation = tCtx.globalCompositeOperation;
		//set to draw behind current content
		tCtx.globalCompositeOperation = "destination-over";
    tCtx.fillStyle = '#fff'
    tCtx.fillRect(0,0,tCtx.canvas.width,tCtx.canvas.height)

    imageElem.src = tCtx.canvas.toDataURL();

    rCtx.fillText(text, 0,15)
    var compositeOperationR = rCtx.globalCompositeOperation;
    //set to draw behind current content
    rCtx.globalCompositeOperation = "destination-over";
    rCtx.fillStyle = '#fff'
    rCtx.fillRect(0,0,rCtx.canvas.width,rCtx.canvas.height)
    dataUrls[i]=rCtx.canvas.toDataURL();
    widths[i] = rCtx.canvas.width;
  }
  return widths
}



function manageTabs(){
var _OPTION = 999;
var button0 = document.getElementById("btn0");
var button1 = document.getElementById("btn1");
var button2 = document.getElementById("btn2");
var button3 = document.getElementById("btn3");
var button4 = document.getElementById("btn4");
var button5 = document.getElementById("btn5");
button0.addEventListener('click', (evt) => {
  _OPTION = 0
})
button1.addEventListener('click', (evt) => {
  _OPTION = 1
})
button2.addEventListener('click', (evt) => {
  _OPTION = 2
})
button3.addEventListener('click', (evt) => {
  _OPTION = 3
})
button4.addEventListener('click', (evt) => {
  _OPTION = 4
})
button5.addEventListener('click', (evt) => {
  _OPTION = 5
})
var submitType = document.getElementById("submitType");
var submitUpload  = document.getElementById("submitUpload");
var submitDraw  = document.getElementById("submitDraw");

submitType.addEventListener('click', async function(evt){

  if(_OPTION != 999){
    //console.log("dataUrls[",_OPTION,"]: ",dataUrls[_OPTION])

    document.getElementById("myModal").style.display = "none";
    document.getElementById("myModal-loader").style.display = "block";
    document.getElementById("loader").style.display = "block";
    document.getElementById("loaderText").style.display = "block";

    var blobImage = dataURItoBlob(dataUrls[_OPTION])
    var imageArrayBuffer = await blobImage.arrayBuffer()
    console.log("this is the imageArrayBuffer:")
    console.log(imageArrayBuffer)
    var pdfInfoBytes = await createPDFwithSignatureInfo()
    readDocument(pdfInfoBytes,imageArrayBuffer, widths[_OPTION])
  }
})

submitUpload.addEventListener('click', async function(evt){
  const TYPE_PDF = 'application/pdf'
  const TYPE_JPG = 'image/jpeg'
  const TYPE_PNG = 'image/png'

  if(document.getElementById('image').files.length == 0 ){
    document.querySelector('#show-image-error').innerHTML = 'please, upload a valid image file'
  }else{
  var inputSignature = document.getElementById('image').files[0];
  console.log("type: ",inputSignature.type)
    if(inputSignature.type == TYPE_PDF){
      //var pdfInfoBytes = await createPDFwithSignatureInfo()
      document.getElementById("myModal").style.display = "none";
      document.getElementById("myModal-loader").style.display = "block";
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderText").style.display = "block";
      readImageFromPDF()
    }else if(inputSignature.type == TYPE_JPG || inputSignature.type == TYPE_PNG){
      //var pdfInfoBytes = await  createPDFwithSignatureInfo()
      document.getElementById("myModal").style.display = "none";
      document.getElementById("myModal-loader").style.display = "block";
      document.getElementById("loader").style.display = "block";
      document.getElementById("loaderText").style.display = "block";
      readImage()
    }else{
      document.querySelector('#show-image-error').innerHTML = 'Invalid image format'
    }
  }
})

submitDraw.addEventListener('click', async function(evt){
  var canvas = document.getElementById("signature-canvas");
  var dataUrl = canvas.toDataURL();
  var blobImage = dataURItoBlob(dataUrl)
  var imageArrayBuffer = await blobImage.arrayBuffer()

  document.getElementById("myModal").style.display = "none";
  document.getElementById("myModal-loader").style.display = "block";
  document.getElementById("loader").style.display = "block";
  var pdfInfoBytes = await createPDFwithSignatureInfo()
  readDocument(pdfInfoBytes,imageArrayBuffer)
})


}
