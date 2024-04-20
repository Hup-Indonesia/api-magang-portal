import { deleteEducationById, getAllEducations, getEducationById, updateEducationById } from "../controllers/educations.controller";
import express from "express";
  
const educationsRouter = express.Router();

educationsRouter.get("/", getAllEducations);
educationsRouter.get("/:id", getEducationById);
educationsRouter.put("/:id", updateEducationById);
educationsRouter.delete("/:id", deleteEducationById);

export default educationsRouter;
  