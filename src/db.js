import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
  useNewUrlParser : true,
  useUnifiedTopology : true,
});

const db = mongoose.connection;

//DB연결 성공/실패에 따라 표현하는 Function
const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log("DB ERROR : " + error);

db.on("error", handleError);
db.once("open", handleOpen);
//once는 한번만 실행한다는 뜻임
//위 2개는 이벤트리스너처럼 사용함