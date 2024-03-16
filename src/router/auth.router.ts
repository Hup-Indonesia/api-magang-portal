import { Login, Logout, Refresh, Register } from "../controllers/auth.controller";
import express from "express";
    
const authRouter = express.Router();

authRouter.get("/refresh", Refresh)
authRouter.post("/login", Login)
authRouter.post("/register", Register)
authRouter.post("/logout", Logout)
    
export default authRouter;
    