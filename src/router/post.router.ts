import { CreatePostExternal, getAllPost, getPostById, updatePost, DeletePost } from "../controllers/post.controller";
import express from "express";
    
const postRouter = express.Router();

postRouter.get("/", getAllPost)
postRouter.get("/:id", getPostById)
postRouter.post("/external", CreatePostExternal)
postRouter.put("/:id", updatePost)
postRouter.delete("/:id", DeletePost)
    
export default postRouter;