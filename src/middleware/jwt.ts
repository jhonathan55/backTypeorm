import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import config from "../config/config";


export const checkJwt=(req:Request,res:Response, next :NextFunction)=>{
    const token = <string>req.headers['auth'];
    console.log(token);
    let jwtPayload;
    try {
        jwtPayload= jwt.verify(token,config.jwtSecret);
        res.locals.jwtPayload=jwtPayload;
        console.log("jwtPayload",jwtPayload);
        
    } catch (error) {
        return res.status(401).json({
            message:'not authorized token erroneo'
        ,error})
    }
    const {userId, username}= jwtPayload
    const newToken=jwt.sign({userId,username},
        config.jwtSecret,{
        expiresIn:'1h'
    })
    res.setHeader('token',newToken)
    next()
}