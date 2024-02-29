import express, {Response, Request} from "express";
import { validateTokenWebsite, validateTokenWebsiteSuper } from "../config/JWT";
import { sign, verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();



router.get("/", (req: Request, res: Response, next) => {
  res.render("Home");
});

router.get("/magang-portal", (req: Request, res: Response, next) => {
  res.render("MagangPortal");
});

router.get("/terms-of-service", (req: Request, res: Response) => {
  res.render("TermAndService");
});
router.get("/privacy-policy", (req: Request, res: Response) => {
  res.render("PrivacyPolicy");
});


export default router;
