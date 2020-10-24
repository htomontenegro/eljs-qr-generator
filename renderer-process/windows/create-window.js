const { BrowserWindow, dialog } = require("electron").remote;
// const { dialog } = require("electron");

const path = require("path");
var QRCode = require("qrcode");
var htmlToImage = require("html-to-image");
var download = require("downloadjs");

var form = document.getElementById("form1");
var imgDownloadable = document.getElementById("image-download");
var imgContainer = document.getElementById("image-container");
var inputPasillo = document.getElementById("pasillo");
var inputNivel = document.getElementById("nivel");
var inputUbicacion = document.getElementById("ubicacion");
var img = document.getElementById("image");
var textPasillo = document.getElementById("text-pasillo");
var textUbicacion = document.getElementById("text-ubicacion");
var textNivel = document.getElementById("text-nivel");

imgDownloadable.addEventListener("click", (event) => {
  // console.log("QR IMAGE CLICKED");

  var pasillo = imgDownloadable.getAttribute("pasillo");
  var ubicacion = imgDownloadable.getAttribute("ubicacion");
  var nivel = imgDownloadable.getAttribute("nivel");

  var fileName = `P${pasillo}U${ubicacion}N${nivel}`;
  htmlToImage.toPng(imgDownloadable).then(function (dataUrl) {
    download(dataUrl, fileName + ".png");
  });
});

function showPrintWindow() {
  // const newWindowBtn = document.getElementById("new-window");
  // const modalPath = path.join(
  //   "file://",
  //   __dirname,
  //   "../../sections/windows/modal.html"
  // );
  // let win = new BrowserWindow({ frame: false, width: 400, height: 320 });
  // win.on("close", () => {
  //   win = null;
  // });
  // win.loadURL(modalPath);
  // win.show();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  cleanImage();

  if (!inputPasillo.value) {
    inputPasillo.style.borderColor = "red";
    return;
  }
  if (!inputUbicacion.value) {
    inputUbicacion.style.borderColor = "red";
    return;
  }
  if (!inputNivel.value) {
    inputNivel.style.borderColor = "red";
    return;
  }

  var detalle = {
    pasillo: inputPasillo.value,
    ubicacion: inputUbicacion.value,
    nivel: inputNivel.value,
  };
  var opts = {
    errorCorrectionLevel: "H",
    type: "png",
  };

  qrToScreen({ opts }, detalle);
  // // generateQR(opts);
  // qrDownload("C:/Users/htomo/Desktop");
});

function qrDownload(selectedPath) {
  let fileName = Math.floor(Math.random() * 9999) + 1000;
  let text = "Text de ejempl";
  QRCode.toFile(selectedPath + "/" + fileName + ".png", text, {}, function (
    err
  ) {
    if (err) throw err;
    console.log("done");
  });
}

function prompDialog() {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      // console.log("result.canceled =>", result.canceled);
      // console.log("result.filePaths =>", result.filePaths);
      selectedPath = result.filePaths;
      // qrToFile(selectedPath, "texto ejemplo");
    })
    .catch((err) => {
      console.log(err);
    });
}

function qrToScreen(opts, detalle) {
  var text = "pasillo: "+ detalle.pasillo + " - Ubicacion: " + detalle.ubicacion + " Nivel: " + detalle.nivel +"";
  QRCode.toDataURL(text, opts, function (err, url) {
    imgDownloadable.style.backgroundColor = "white";
    imgContainer.style.display = "flex";
    imgDownloadable.setAttribute("pasillo", detalle.pasillo);
    imgDownloadable.setAttribute("ubicacion", detalle.ubicacion);
    imgDownloadable.setAttribute("nivel", detalle.nivel);
    if (err) throw err;

    img.src = url;

    textPasillo.innerText = "Pasillo " + detalle.pasillo;
    textUbicacion.innerText = "Ubicacion " + detalle.ubicacion;
    textNivel.innerText = "Nivel " + detalle.nivel;
  });
}

function cleanImage() {
  imgContainer.style.display = "none";
  imgDownloadable.style.backgroundColor = "";

  img.src = "";
  textPasillo.innerText = "";
  textUbicacion.innerText = "";
  textNivel.innerText = "";

  inputPasillo.style.borderColor = "";
  inputNivel.style.borderColor = "";
  inputUbicacion.style.borderColor = "";
}
const generateQR = async (text) => {
  try {
    let response = await QRCode.toDataURL("text");
    console.log("respuesta => ", response);
  } catch (err) {
    console.error(err);
  }
};
