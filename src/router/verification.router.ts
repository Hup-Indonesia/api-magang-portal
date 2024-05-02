import express from "express";
import { SendVerificationEmail, VerifyVerificationCode } from "../controllers/verification.controller";
    
const verificationRouter = express.Router();

verificationRouter.get("/request", SendVerificationEmail)
verificationRouter.post("/verify", VerifyVerificationCode)
    
export default verificationRouter;
    