import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
//서버 생성과 같음
//서버 응답에 대해 코딩할 때 서버 생성 코드 이후로 코딩을 해야함
//------------------------------(샌드위치 처럼 사용함)
const logger = morgan("dev");
const handleHome = (req, res) => {
  console.log("I wiil respond.");
  return res.send("hello");
}
const login = (req, res) => {
  return res.send("login");
}

app.use(logger);
app.get("/", handleHome);
app.get("/login", login);

//-------------------------------
const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);