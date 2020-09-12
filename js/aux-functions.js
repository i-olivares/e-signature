  function arrayStringToBase64(arr) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(arr)));
  };


  function arrayBufferToBase64String(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer)
    var byteString = '';
    for (var i=0; i<byteArray.byteLength; i++) {
      byteString += String.fromCharCode(byteArray[i]);
    }
    return btoa(byteString);
  };

  function base64StringToArrayBuffer(b64str) {
    var byteStr = atob(b64str);
    var bytes = new Uint8Array(byteStr.length);
    for (var i = 0; i < byteStr.length; i++) {
      bytes[i] = byteStr.charCodeAt(i);
    }
    return bytes.buffer;
  };


function textToArrayBuffer(str) {
  var buf = unescape(encodeURIComponent(str)); // 2 bytes for each char
  var bufView = new Uint8Array(buf.length);
  for (var i=0; i < buf.length; i++) {
    bufView[i] = buf.charCodeAt(i);
  }
  return bufView;
};



function strToBase64(text){
  var Base64 =
  {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
   encode:function(e){
    var t="";
    var n,r,i,s,o,u,a;
    var f=0;
    e=Base64._utf8_encode(e);
    while(f<e.length){
      n=e.charCodeAt(f++);
      r=e.charCodeAt(f++);
      i=e.charCodeAt(f++);
      s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;
      if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}
      t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)
    }
    return t
  },
  decode:function(e){
    var t="";
    var n,r,i;
    var s,o,u,a;
    var f=0;
    e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");
    while(f<e.length){
      s=this._keyStr.indexOf(e.charAt(f++));
      o=this._keyStr.indexOf(e.charAt(f++));
      u=this._keyStr.indexOf(e.charAt(f++));
      a=this._keyStr.indexOf(e.charAt(f++));
      n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;
      t=t+String.fromCharCode(n);
      if(u!=64){
        t=t+String.fromCharCode(r)
      }
      if(a!=64){
        t=t+String.fromCharCode(i)
      }
    }
    t=Base64._utf8_decode(t);
    return t
  },
  _utf8_encode:function(e){
    e=e.replace(/\r\n/g,"\n");
    var t="";
    for(var n=0;n<e.length;n++){
      var r=e.charCodeAt(n);
      if(r<128){
        t+=String.fromCharCode(r)
      }else if(r>127&&r<2048){
        t+=String.fromCharCode(r>>6|192);
        t+=String.fromCharCode(r&63|128)
      }else{
        t+=String.fromCharCode(r>>12|224);
        t+=String.fromCharCode(r>>6&63|128);
        t+=String.fromCharCode(r&63|128)
      }
    }
    return t
  },
  _utf8_decode:function(e){
    var t="";
    var n=0;
    var r=c1=c2=0;
    while(n<e.length){
      r=e.charCodeAt(n);
      if(r<128){
        t+=String.fromCharCode(r);
        n++
      }else if(r>191&&r<224){
        c2=e.charCodeAt(n+1);
        t+=String.fromCharCode((r&31)<<6|c2&63);
        n+=2
      }else{
        c2=e.charCodeAt(n+1);
        c3=e.charCodeAt(n+2);
        t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);
        n+=3}
      }
      return t}
    }
    return Base64.encode(text)
}

function appendBuffers (buffer1, buffer2) {
 var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
 tmp.set(new Uint8Array(buffer1), 0);
 tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
 return tmp.buffer;
};

function dataURItoBlob(dataURI) {
   // convert base64/URLEncoded data component to raw binary data held in a string
   var byteString;
   if (dataURI.split(',')[0].indexOf('base64') >= 0)
       byteString = atob(dataURI.split(',')[1]);
   else
       byteString = unescape(dataURI.split(',')[1]);

   // separate out the mime component
   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

   // write the bytes of the string to a typed array
   var ia = new Uint8Array(byteString.length);
   for (var i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
   }

   return new Blob([ia], {type:mimeString});
}

function saveByteArray(reportName, byte,  element) {
    var blob = new Blob([byte], {type: "application/pdf"});
    var link = document.getElementById(element);
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
};


function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

function resizeImageData(input){
  const arr = new Uint8ClampedArray(input.length*4/3);
  var k=0;
  // Iterate through every pixel
  for (let i = 0; i < arr.length; i += 4) {
    arr[i + 0] = input[k+0];    // R value
    arr[i + 1] = input[k+1];  // G value
    arr[i + 2] = input[k+2];    // B value
    arr[i + 3] = 255;  // A value
    k=k+3;
  }
  return arr
}




function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}
