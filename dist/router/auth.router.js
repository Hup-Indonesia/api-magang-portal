"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
authRouter.get("/refresh", auth_controller_1.Refresh);
authRouter.post("/login", auth_controller_1.Login);
authRouter.post("/register", auth_controller_1.Register);
authRouter.post("/logout", auth_controller_1.Logout);
exports.default = authRouter;
//# sourceMappingURL=auth.router.js.map