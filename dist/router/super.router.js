"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const JWT_1 = require("../config/JWT");
dotenv.config();
const superRouter = express_1.default.Router();
superRouter.post("/login", async (req, res) => {
    const loginData = req.body;
    try {
        if (loginData.super_email == process.env.SUPER_EMAIL && loginData.super_password == process.env.SUPER_PASSWORD) {
            const accessToken = (0, JWT_1.createTokenSuper)(loginData);
            res.cookie("access-token-super", accessToken, {
                maxAge: 360000000,
            });
            return res.status(200).json({
                status_code: 200,
                message: "Authenticated User"
            });
        }
        else {
            return res.status(400).json({
                message: "Wrong email and password combination !"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
exports.default = superRouter;
//# sourceMappingURL=super.router.js.map