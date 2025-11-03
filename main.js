// load model from github path
let modelURL = "models/yolov8s.onnx";

let session = null;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let video = document.getElementById("video");

async function loadModel(){
    if(!session){
        session = await ort.InferenceSession.create(modelURL);
    }
}

function drawBox(x1,y1,x2,y2,label){
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;
    ctx.strokeRect(x1,y1,(x2-x1),(y2-y1));
    ctx.fillStyle="lime";
    ctx.font="14px Arial";
    ctx.fillText(label,x1,y1-4);
}

async function runImg(img){
    await loadModel();

    ctx.drawImage(img,0,0,640,480);
    // here normally decode output but fake demo
    drawBox(50,50,200,200,"object");
}

function selectImage(){
    let i = document.createElement("input");
    i.type="file"; i.accept="image/*";
    i.onchange = ()=>{
        let img = new Image();
        img.onload = ()=> runImg(img);
        img.src = URL.createObjectURL(i.files[0]);
    }
    i.click();
}

function selectVideo(){
    alert("demo trimmed: video control later — first get model working");
}

function startWebcam(){
    alert("demo trimmed: webcam later — first confirm image works");
}
