import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

//String변수를 만들어 복붙오류를 최소화
const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

//다운로드 할 수 있도록 만드는 함수
const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  a.click();
};

const handleDownload = async () => {
  //한 번 클릭하면 다운로드 더이상 할 수 없도록 만듦
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;
  //파일 다운로드할 때까지 disabled처리
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  //js에서 다른 소프트웨어를 load해서 사용하는 것이기 때문에 load를 await해줘야함
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);
  //사용자의 콘솔에서 run을 실행하는 것임
  //이미 recording.webm파일이 생성되어 있기 때문에 접근 가능함
  //마지막으로 결과물의 이름과 포멧지정(recording.webm -> output.mp4과정)
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  //파일이 이진배열형태임
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  //썸네일 Blob형태로 만듦(이진배열을 Blob형태로 변환)
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);
  //썸네일 Blob에 접근가능한 URL만듦
  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnai.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);
  //링크해제를 통해 시스템을 가볍게함

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
  //URL도 삭제해주면 가벼워짐
  actionBtn.disabled = false;
  //파일 다운로드 후 삭제까지 완료하면 버튼 활성화
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
  //다시 촬영을 위해 이벤트 추가
};

const handleStart = () => {
  actionBtn.innerText = "Recoding...";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  //녹화가 중단되고 파일이 만들어지면 생기는 이벤트
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.scrObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    //stop recording버튼 클릭시 기존에 보여주던 화면을 지우고
    //url을 src에 연결해 녹화한 파일을 보여줌
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  }
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 1024, height: 576 },
  });
  video.srcObject = stream;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);