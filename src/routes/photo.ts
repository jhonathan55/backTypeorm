import { Router } from "express";
import { PhotoController } from "../controller/PhotoController";

const route = Router();
route.get('/', PhotoController.getAll);
export default route;