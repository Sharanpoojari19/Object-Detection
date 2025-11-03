let session;
let canvas = document.getElementById("out");
let ctx = canvas.getContext("2d");
let video = document.getElementById("vid");

(async()=>{
  session = await ort.InferenceSession.create("./model/yolov8n.onnx");
})();

async function runModel(imgData){
  let tensor = new ort.Tensor("float32", imgData.data, [1, imgData.height, imgData.width, 4]);
  let r = await session.run({images:tensor});
  drawBoxes(r.output0, imgData.width, imgData.height);
}

function drawBoxes(dets,w,h){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(tempImg,0,0);

  dets.data.forEach((v,i)=>{
    if(i%6===0){
      let x=v*640;
      let y=dets.data[i+1]*480;
      let x2=dets.data[i+2]*640;
      let y2=dets.data[i+3]*480;
      ctx.strokeStyle="red";
      ctx.strokeRect(x,y,x2-x,y2-y);
    }
  });
}

function loadImage(){
  let inp=document.createElement("input");
  inp.type="file";
  inp.accept="image/*";
  inp.onchange=e=>{
    let file=URL.createObjectURL(e.target.files[0]);
    tempImg=new Image();
    tempImg.onload=()=>{
      ctx.drawImage(tempImg,0,0,640,480);
      let iData=ctx.getImageData(0,0,640,480);
      runModel(iData);
    };
    tempImg.src=file;
  }
  inp.click();
}

function loadVideo(){
  let inp=document.createElement("input");
  inp.type="file";
  inp.accept="video/*";
  inp.onchange=e=>{
    video.src=URL.createObjectURL(e.target.files[0]);
    video.onplay=()=>loopVid();
    video.style.display="block";
    video.play();
  }
  inp.click();
}

function loopVid(){
  if(video.paused||video.ended)return;
  ctx.drawImage(video,0,0,640,480);
  let iData=ctx.getImageData(0,0,640,480);
  runModel(iData);
  requestAnimationFrame(loopVid);
}

async function startWebcam(){
  let stream=await navigator.mediaDevices.getUserMedia({video:true});
  video.srcObject=stream;
  video.onplay=()=>loopVid();
  video.style.display="block";
  video.play();
}
