import "./db";
import "./models/Video";
//여기서 순서 중요한듯 DB먼저 연결하고 그 다름 Model연결
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended:true}))
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", globalRouter);

export default app;
//express에서는 생성하고 cofiguration관련 코드만 처리해주도록 만들 것임
//DB나 models등을 임포트하기 위한 곳이 아님 서버관련 코드만 처리