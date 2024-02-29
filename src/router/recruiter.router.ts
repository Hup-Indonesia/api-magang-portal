import {
  CreateRecruiter,
  DeleteRecruiter,
  addGallery,
  addPost,
  deleteGallery,
  editPost,
  getAllRecruiter,
  getRecruiterById, 
  updateRecruiter,
  verificationRecruiter,
  } from "../controllers/recruiter.controller";
  import express from "express";
  
  const recruiterRouter = express.Router();
  
  recruiterRouter.get("/", getAllRecruiter)
  recruiterRouter.get("/:id", getRecruiterById);
  recruiterRouter.post("/external", CreateRecruiter);
  recruiterRouter.post("/:id/gallery", addGallery);
  recruiterRouter.post("/:id/post", addPost);
  recruiterRouter.put("/:id", updateRecruiter);
  recruiterRouter.put("/:id/verification", verificationRecruiter);
  recruiterRouter.put("/:id/post/:postId", editPost);
  recruiterRouter.delete("/gallery/:galleryId", deleteGallery);
  recruiterRouter.delete("/:id", DeleteRecruiter);
  
  export default recruiterRouter;
  