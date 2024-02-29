import { sign, verify } from "jsonwebtoken";
import response from "../controllers/response";
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
dotenv.config();

declare module 'express' {
    interface Request {
      user?: any; // Ganti 'any' dengan jenis data yang sesuai untuk 'user'.
      authenticate?: boolean
    }
}

const JWT_SECRET = process.env.JWT_SECRET

const createTokenSuper = (user) => {
  const accessToken = sign(
    {
      id: "jxYDBqQ1prC5Np66Dda81y6HkAsYbC4H",
    },
    JWT_SECRET
  );
  return accessToken;
};

const validateTokenWebsiteSuper = (req: Request, res:Response, next:NextFunction) => {
  const accessToken = req.cookies["access-token-super"];
  // if token expired or not login
  if (!accessToken) return res.redirect("/su/login")
  try {
    verify(accessToken, JWT_SECRET, function(err, user){
      if(err) return res.redirect("/su/login")
      req.user = user
      next()
    });
  } catch (error) {
    return response(500, "server error", { error: error.message }, res);
  }
};

const createToken = (user) => {
  const accessToken = sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET
  );
  return accessToken;
};

const validateTokenWebsite = (req: Request, res:Response, next:NextFunction) => {
  const accessToken = req.cookies["access-token"];
  // if token expired or not login
  if (!accessToken) return res.redirect("/login")
  try {
    verify(accessToken, JWT_SECRET, function(err, user){
      if(err) return res.redirect("/login")
      req.user = user
      next()
    });
  } catch (error) {
    return response(500, "server error", { error: error.message }, res);
  }
};

export {
    createToken,
    validateTokenWebsite,
    createTokenSuper,
    validateTokenWebsiteSuper
}
