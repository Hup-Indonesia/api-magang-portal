import {
  getAllSeeker,
  getSeekerById,
  updateSeeker,
  deleteSeeker,
  addExperience,
  addEducation,
  setAttachment,
  deleteAttachment,
  addRecruiter,
  addSavedPost,
  addApplied,
  getExperienceBySeekerId,
  getEducationsBySeekerId,
  getAllSavedPostBySeekerId,
  getAllAppliedPostBySeekerId,
  getAttachmentBySeekerId,
  forgetPasswordWithEmail,
  checkEmailIsUsed,
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

mahasiswaRouter.post("/check-email", checkEmailIsUsed);
mahasiswaRouter.post("/:id/experience", addExperience);
mahasiswaRouter.post("/:id/education", addEducation);
mahasiswaRouter.post("/:id/attachment", setAttachment);
mahasiswaRouter.post("/:id/save-post", addSavedPost);
mahasiswaRouter.post("/:id/posts/:postId", addApplied);
mahasiswaRouter.post("/:id/recruiter", addRecruiter);

mahasiswaRouter.put("/forget-password", forgetPasswordWithEmail);
mahasiswaRouter.put("/:id", updateSeeker);

mahasiswaRouter.delete("/:id", deleteSeeker);
mahasiswaRouter.delete("/:id/attachment", deleteAttachment);

export default mahasiswaRouter;
