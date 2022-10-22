import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }))
//form에서 전송하는 데이터 인식하기 위한 설정

//express-session사용
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    //밑에 작성을 통해 session ID등을 mongodb에 저장하게 됨
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    })
  }));

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
//static에는 폴더명을 정확하게 사용하지만 경로는 원하는 이름 작성 가능함
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", rootRouter);

export default app;
//express에서는 생성하고 cofiguration관련 코드만 처리해주도록 만들 것임
//DB나 models등을 임포트하기 위한 곳이 아님 서버관련 코드만 처리