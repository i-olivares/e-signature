window.onload =  function(){
        var modal = document.getElementById("myModal");
        //var modalButton = document.getElementById("myModal-button");
        document.getElementById("myModal-loader").style.display = "none";

        //modalButton.style.display = "block";

        var span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
          modal.style.display = "none";
        }

        let pdfContainer = document.getElementById('canvas')

        pdfViewer = new pdfjsViewer.PDFViewer({
                container : pdfContainer
        })

        pdfContainer.addEventListener('click', (evt) => {
                //console.log("Estoy en pdfContainer.addEventListener('click')")
                modal.style.display = "block";

                var pg = document.getElementById('canvas')
                var rect = pg.getBoundingClientRect()
                var bodyElt = document.body;

                let x = evt.pageX - rect.left - bodyElt .scrollLeft
                let y = evt.pageY - rect.top -  bodyElt .scrollTop

                coordinates[0]=x
                coordinates[1]=y
                updateCoordinates()

        })

        manageTabs()

}
