import express from "express";
import { join, login } from "../Controllers/userController";
import { trending, search } from "../Controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;