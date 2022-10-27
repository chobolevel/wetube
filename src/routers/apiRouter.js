import express from "express";
import { registerView, createComment, deleteComment } from "../Controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/comments/:c_id([0-9a-f]{24})/:v_id([0-9a-f]{24})", deleteComment);

export default apiRouter;