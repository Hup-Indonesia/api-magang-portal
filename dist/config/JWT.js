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
exports.validateTokenWebsiteSuper = exports.createTokenSuper = exports.validateTokenWebsite = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const response_1 = __importDefault(require("../controllers/response"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const createTokenSuper = (user) => {
    const accessToken = (0, jsonwebtoken_1.sign)({
        id: "jxYDBqQ1prC5Np66Dda81y6HkAsYbC4H",
    }, JWT_SECRET);
    return accessToken;
};
exports.createTokenSuper = createTokenSuper;
const validateTokenWebsiteSuper = (req, res, next) => {
    const accessToken = req.cookies["access-token-super"];
    // if token expired or not login
    if (!accessToken)
        return res.redirect("/su/login");
    try {
        (0, jsonwebtoken_1.verify)(accessToken, JWT_SECRET, function (err, user) {
            if (err)
                return res.redirect("/su/login");
            req.user = user;
            next();
        });
    }
    catch (error) {
        return (0, response_1.default)(500, "server error", { error: error.message }, res);
    }
};
exports.validateTokenWebsiteSuper = validateTokenWebsiteSuper;
const createToken = (user) => {
    const accessToken = (0, jsonwebtoken_1.sign)({
        id: user.id,
        role: user.role,
    }, JWT_SECRET);
    return accessToken;
};
exports.createToken = createToken;
const validateTokenWebsite = (req, res, next) => {
    const accessToken = req.cookies["access-token"];
    // if token expired or not login
    if (!accessToken)
        return res.redirect("/login");
    try {
        (0, jsonwebtoken_1.verify)(accessToken, JWT_SECRET, function (err, user) {
            if (err)
                return res.redirect("/login");
            req.user = user;
            next();
        });
    }
    catch (error) {
        return (0, response_1.default)(500, "server error", { error: error.message }, res);
    }
};
exports.validateTokenWebsite = validateTokenWebsite;
//# sourceMappingURL=JWT.js.map