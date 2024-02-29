import { Request, Response, query } from "express";
import Seeker from "../models/Seeker";
import Experience from "../models/Experience";
import Education from "../models/Education";
import response from "./response";
import * as bcrypt from 'bcrypt';
import { createToken } from "../config/JWT";
import Attachment from "../models/Attachment";
import path from "path";
import fs from "fs"
import Recruiter from "../models/Recruiter";
import Gallery from "../models/Gallery";
import Post from "../models/Post";
import { Op } from "sequelize";
import cron from "node-cron"


export const getAllPost = async (req: Request, res: Response) => {
    try {
      let postQuery = req.query
      
      let page = req.query.page || 1
      let limit = req.query.limit || 9999

      let startIndex = (+page - 1) * +limit
      let endIndex = +page * +limit
      
      const post = await Post.findAll({attributes:{exclude:["createdAt","updatedAt"]}, include:[
        {model:Recruiter, as: "recruiter",attributes:{exclude:["createdAt","updatedAt","ownerId"]}, through:{attributes:[]}},
        {model:Seeker, as: "applicants",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
        {model:Seeker, as: "saved",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
      ]});
      const result = post.slice(startIndex, endIndex)
      return response(200, "success call all posts", result, res);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      res.status(500).json({ error: "Server error" });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
      const post = await Post.findOne({where:{id:req.params.id},attributes:{exclude:["createdAt","updatedAt"]}, include:[
        {model:Recruiter, as: "recruiter",attributes:{exclude:["createdAt","updatedAt","ownerId"]}, through:{attributes:[]}},
        {model:Seeker, as: "applicants",attributes:{exclude:["createdAt","updatedAt","ownerId"]},include:[
          {model:Experience, as:"experiences", attributes:{exclude:["createdAt","updatedAt"]}},
          {model:Education, as:"educations", attributes:{exclude:["createdAt","updatedAt"]}},
        ]},
        {model:Seeker, as: "saved",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
      ]});
      if(post){
        return response(200, "success get all posts", post, res);
      }else{
        return response(404, "post not found", [], res);
      }
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      res.status(500).json({ error: "Server error" });
    }
};

export const updatePosts = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const updatedPost = req.body; // Data pembaruan pengguna dari permintaan PUT  

  try {
    const post = await Post.findByPk(postId);
    if (post) {
      await post.update(updatedPost);
      response(200, "Success update pengguna", post, res)
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};



export const CreatePostExternal = async (req: Request, res: Response) => {
  let postData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
  const recruiterId = postData.recruiter_id
  try {
    const recruiter = await Recruiter.findByPk(recruiterId);

    if(postData.post_resume_req !== undefined) postData.post_resume_req = true
    if(postData.post_portfolio_req !== undefined) postData.post_portfolio_req = true
    
    if(postData.post_thp_type !== "Undisclosed"){
      if(postData.post_thp_min && !postData.post_thp_max) postData.post_thp = `Rp.${postData.post_thp_min}+`
      if(!postData.post_thp_min && postData.post_thp_max) postData.post_thp = `Rp.0-Rp.${postData.post_thp_max}`
      if(postData.post_thp_min && postData.post_thp_max) postData.post_thp = `Rp.${postData.post_thp_min}-Rp.${postData.post_thp_max}`
    }else{
      postData.post_thp = "Undisclosed"
    }
    
    postData.post_mode = "External"

    if (recruiter) {
      await Post.create(postData).then(async function(result){
        await recruiter.addPost(result)
        response(200, "Success update pengguna", recruiter, res)
      })
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal membuat pengguna:", error);
    res.status(500).json({ error: error });
  }
};

export const DeletePost = async (req: Request, res: Response) => {
  const postId = req.params.id
  const POST = await Post.findByPk(postId)
  
  try{
    if (POST) {
      POST.destroy()
      return response(200, "Success menghapus post", [], res)
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal menghapus post:", error);
    res.status(500).json({ error: error });
  }
};


cron.schedule('0 */2 * * *', () => {
  CronAutoCloseJob()
});

async function CronAutoCloseJob(){
  const POSTS = await Post.findAll()
  POSTS.forEach(async post => {
    let isOnDate = compareDates(post.post_deadline);
    if(isOnDate == false){
      post.update({post_status: "CLOSED"})
    }
  })
}

function compareDates(inputDate) {
  const today = new Date();
  const inputDateObject = new Date(inputDate);

  // Atur jam, menit, detik, dan milidetik ke nol untuk membandingkan hanya tanggal
  today.setHours(0, 0, 0, 0);
  inputDateObject.setHours(0, 0, 0, 0);

  // Bandingkan tanggal
  if (today.getTime() === inputDateObject.getTime()) {
    // Jika today sama dengan inputDate
    return false;
  } else if (today.getTime() > inputDateObject.getTime()) {
    // Jika today sudah melebihi inputDate
    return false;
  } else {
    // Jika today masih sebelum inputDate
    return true;
  }
}