import {
  createSeeker,
  getAllSeeker,
  getSeekerById,
  updateSeeker,
  deleteSeeker,
  loginSeeker,
  addExperience,
  deleteExperience,
  addEducation,
  setAttachment,
  deleteEducation,
  updateExperience,
  updateEducation,
  deleteAttachment,
  addRecruiter,
  addSavedPost,
  addApplied,
  logoutSeeker,
} from "../controllers/seeker.controller";
import express from "express";

const mahasiswaRouter = express.Router();

mahasiswaRouter.get("/", getAllSeeker);
mahasiswaRouter.get("/:id", getSeekerById);
mahasiswaRouter.post("/register", createSeeker);
mahasiswaRouter.post("/login", loginSeeker);
mahasiswaRouter.post("/logout", logoutSeeker);
mahasiswaRouter.post("/:id/experience", addExperience);
mahasiswaRouter.post("/:id/education", addEducation);
mahasiswaRouter.post("/:id/attachment", setAttachment);
mahasiswaRouter.post("/:id/save-post", addSavedPost);
mahasiswaRouter.post("/:id/recruiter", addRecruiter);
mahasiswaRouter.post("/:id/posts/:postId", addApplied);
mahasiswaRouter.put("/:id", updateSeeker);
mahasiswaRouter.put("/:id/experience/:updateId", updateExperience);
mahasiswaRouter.put("/:id/education/:updateId", updateEducation);
mahasiswaRouter.delete("/:id", deleteSeeker);
mahasiswaRouter.delete("/:id/experience/:deletionId", deleteExperience);
mahasiswaRouter.delete("/:id/education/:deletionId", deleteEducation);
mahasiswaRouter.delete("/:id/attachment/:fieldName", deleteAttachment);

export default mahasiswaRouter;
