import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended:true}))
//form에서 전송하는 데이터 인식하기 위한 설정

app.use(
  session({
    secret: "Hello",
    resave: true,
    saveUninitialized: true,
}));

app.use(localsMiddleware);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", rootRouter);

export default app;
//express에서는 생성하고 cofiguration관련 코드만 처리해주도록 만들 것임
//DB나 models등을 임포트하기 위한 곳이 아님 서버관련 코드만 처리