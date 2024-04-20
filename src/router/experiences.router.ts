import { deleteExperienceById, getAllExperiences, getExperiencesById, updateExperienceById } from "../controllers/experiences.controller";
import express from "express";
  
const experienceRouter = express.Router();

experienceRouter.get("/", getAllExperiences);
experienceRouter.get("/:id", getExperiencesById);
experienceRouter.put("/:id", updateExperienceById);
experienceRouter.delete("/:id", deleteExperienceById);

export default experienceRouter;
  