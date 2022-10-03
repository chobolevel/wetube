import express from "express";

const PORT = 4000;

const app = express();
//서버 생성과 같음
//서버 응답에 대해 코딩할 때 서버 생성 코드 이후로 코딩을 해야함
//------------------------------(샌드위치 처럼 사용함)
//function

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
}
const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if(url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  console.log("Allowed, you may continue.");
  next();
}
const handleHome = (req, res) => {
  return res.send("I love middlewares");
};
const handleProtected = (req, res) => {
  return res.send("Welcome to the private lounge.");
}

app.use(logger);
app.use(privateMiddleware);
//use매서드는 모든 경로에 대해서 수행하도록 만듦
//use사용시에는 항상 get보다는 먼저 사용해야함
app.get("/", handleHome);
app.get("/protected", handleProtected);

//-------------------------------
const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);