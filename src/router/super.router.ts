import express, {Request, Response} from "express";
import * as dotenv from "dotenv";
import { createTokenSuper } from "../config/JWT";
dotenv.config();
    
const superRouter = express.Router();

superRouter.post("/login", async(req:Request, res:Response) => {
    const loginData = req.body
    try {
        if(loginData.super_email == process.env.SUPER_EMAIL && loginData.super_password == process.env.SUPER_PASSWORD){
            const accessToken = createTokenSuper(loginData);
            res.cookie("access-token-super", accessToken, {
                maxAge: 360000000,
            });
            return res.status(200).json({
                status_code: 200,
                message: "Authenticated User"
            })
        }else{
            return res.status(400).json({
                message: "Wrong email and password combination !"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})
    
export default superRouter;
    