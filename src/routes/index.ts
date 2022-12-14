import { Router } from "express";
import  auth  from "./auth";
import user from "./user";
import category from './category'
import product from "./product";
import "reflect-metadata"
import photo from "./photo";

const routes = Router();

routes.use('/auth',auth);
routes.use('/user',user);
routes.use('/category',category);
routes.use('/product',product);
routes.use('/photo',photo);



export default routes;