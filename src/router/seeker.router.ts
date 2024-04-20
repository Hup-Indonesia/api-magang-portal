import {
  createSeeker,
  getAllSeeker,
  getSeekerById,
  updateSeeker,
  deleteSeeker,
  loginSeeker,
  addExperience,
  addEducation,
  setAttachment,
  deleteAttachment,
  addRecruiter,
  addSavedPost,
  addApplied,
  logoutSeeker,
  getExperienceBySeekerId,
  getEducationsBySeekerId,
  getAllSavedPostBySeekerId,
  getAllAppliedPostBySeekerId,
  getAttachmentBySeekerId,
} from "../controllers/seeker.controller";
import express from "express";

const mahasiswaRouter = express.Router();

mahasiswaRouter.get("/", getAllSeeker);
mahasiswaRouter.get("/:id", getSeekerById);
mahasiswaRouter.get("/:id/experiences", getExperienceBySeekerId);
mahasiswaRouter.get("/:id/educations", getEducationsBySeekerId);
mahasiswaRouter.get("/:id/attachment", getAttachmentBySeekerId);
mahasiswaRouter.get("/:id/saved-posts", getAllSavedPostBySeekerId);
mahasiswaRouter.get("/:id/applied-posts", getAllAppliedPostBySeekerId);

mahasiswaRouter.post("/register", createSeeker);
mahasiswaRouter.post("/login", loginSeeker);
mahasiswaRouter.post("/logout", logoutSeeker);
mahasiswaRouter.post("/:id/experience", addExperience);
mahasiswaRouter.post("/:id/education", addEducation);
mahasiswaRouter.post("/:id/attachment", setAttachment);
mahasiswaRouter.post("/:id/save-post", addSavedPost);
mahasiswaRouter.post("/:id/posts/:postId", addApplied);
mahasiswaRouter.post("/:id/recruiter", addRecruiter);

mahasiswaRouter.put("/:id", updateSeeker);

mahasiswaRouter.delete("/:id", deleteSeeker);
mahasiswaRouter.delete("/:id/attachment", deleteAttachment);

export default mahasiswaRouter;
