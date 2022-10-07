import express from "express";
import { watch, getEdit, postEdit, getUpload, postUpload } from "../Controllers/videoController"

const videoRouter = express.Router();

//upload가 id밑에 있으면 구분을 못하기 때문에 제일 위에서 쓰임
//예)/videos/upload -> watch Video #/upload
//정규식을 이용해서 숫자만 받아오기 때문에 upload는 밑으로 가도 ok
videoRouter.route("/:id([0-9a-f]{24})").get(watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;