"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verification_controller_1 = require("../controllers/verification.controller");
const verificationRouter = express_1.default.Router();
verificationRouter.get("/request", verification_controller_1.SendVerificationEmail);
verificationRouter.post("/verify", verification_controller_1.VerifyVerificationCode);
exports.default = verificationRouter;
//# sourceMappingURL=verification.router.js.map