import express from "express";
import { SendVerification } from "../controllers/verification.controller";
    
const verificationRouter = express.Router();

verificationRouter.post("/:email", SendVerification)
    
export default verificationRouter;
    