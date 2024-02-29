import { CreatePostExternal, getAllPost, getPostById, updatePosts, DeletePost } from "../controllers/post.controller";
import express from "express";
    
const postRouter = express.Router();

postRouter.get("/", getAllPost)
postRouter.get("/:id", getPostById)
postRouter.post("/external", CreatePostExternal)
postRouter.put("/:id", updatePosts)
postRouter.delete("/:id", DeletePost)
    
export default postRouter;
    