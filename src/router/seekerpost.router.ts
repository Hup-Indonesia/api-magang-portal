import express from "express";
import { getAllSeekerPost, getSeekerPostById, updateInterview, updateOffering, updateSeekerPost } from "../controllers/seekerpost.controller";
    
const postRouter = express.Router();

postRouter.get("/", getAllSeekerPost)
postRouter.get("/:id", getSeekerPostById)
postRouter.put("/interview/:id", updateInterview)
postRouter.put("/offering/:id", updateOffering)
postRouter.put("/:id", updateSeekerPost)
    
export default postRouter;
    