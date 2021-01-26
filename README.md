# e-signature - electronic signature tool for PDF's
 
Both the front-end and back-end are implemented. The front-end has a log-in system to keep track of the changes that every user does on the documents. The information of each user is stored in a MySQL database in the server side. An example of the Log in and Registration process is shown in the images below:

![image](https://user-images.githubusercontent.com/57218498/105897651-bcec0c80-6018-11eb-8c83-3adbd80e102b.png)

The code for the signing process is based on the npm package node-signpdf (https://www.npmjs.com/package/node-signpdf) although many parts of the code have been modified by me. The signature is made using a #PKCS12 standard. Once the file is uploaded, the internal structure of the pdf (see image below on the left) is modified to include the information of the electronic signature and the e-signed file can be again downloaded. An audit trail of every change or visualization of the document is carried out and is also added in a .zip file when the signed pdf is downdoaded (see fig. on the right bottom).

![image](https://user-images.githubusercontent.com/57218498/105899899-967ba080-601b-11eb-9da0-6fc9d9ef45be.png)
