import { Login, Logout, Refresh, Register, RegisterLoginWithGoogle } from "../controllers/auth.controller";
import express from "express";
    
const authRouter = express.Router();

authRouter.get("/refresh", Refresh)
authRouter.post("/login", Login)
authRouter.post("/google", RegisterLoginWithGoogle)
authRouter.post("/register", Register)
authRouter.post("/logout", Logout)
    
export default authRouter;
    