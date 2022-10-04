import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

console.log(process.cwd());

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
//html대신 pug사용한다고 server에 알림
app.set("views", process.cwd() + "/src/views");
//경로 설정
app.use(logger);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", globalRouter);

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);