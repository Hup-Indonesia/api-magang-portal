import { Request, Response } from "express";
import Seeker from "../models/Seeker";
import Experience from "../models/Experience";
import Education from "../models/Education";
import response from "./response";
import Recruiter from "../models/Recruiter";
import Post from "../models/Post";
import cron from "node-cron"


export const getAllPost = async (req: Request, res: Response) => {
    try {
      const search = req.query.search || ""
      const location = req.query.location || ""
      const worktime = req.query.worktime || ""
      const salary = req.query.salary || ""

      let db_page = req.query.page || 1
      let db_limit = req.query.limit || 9
      
      const POST = await Post.findAll({
        limit: +db_limit,
        offset: (+db_page - 1) * +db_limit,
        attributes:{exclude:["createdAt","updatedAt"]}, include:[
          {model:Recruiter, as: "recruiter",attributes:["id", "rec_org_name", "rec_org_website", "rec_org_logo", "rec_mode"], through:{attributes:[]}},
          {model:Seeker, as: "applicants",attributes:["id", "first_name", "last_name", "email", "profile_picture"]},
          {model:Seeker, as: "saved",attributes:["id", "first_name", "last_name", "email", "profile_picture"], through:{attributes:[]}},
      ]});
      

      let filtered_data = POST.filter(post => {
        let post_json = post.toJSON()
        const matchesSearch = post_json.post_position.toLowerCase().includes(search.toString().toLowerCase()) || post_json.post_overview.toLowerCase().includes(search.toString().toLowerCase()) || post_json.recruiter[0].rec_org_name.toLowerCase().includes(search.toString().toLowerCase());
        const matchesLocation = post.post_location.toLowerCase().includes(location.toString().toLowerCase());
        const matchesWorkTime = post.post_work_time_perweek.toLowerCase().includes(worktime.toString().toLowerCase());
        const matchesSalary = post.post_thp.toLowerCase().includes(salary.toString().toLowerCase());
        
        return matchesSearch && matchesLocation && matchesWorkTime && matchesSalary
      })

      const total_page = Math.ceil(await Post.count() / +db_limit);
      
      return res.status(200).json({
        status_code:200,
        message: "success get app posts",
        page: db_page,
        total_page: total_page,
        limit: db_limit,
        datas: filtered_data
      })
    } catch (error) {
      return res.status(500).json({ message: error.message });
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

      if(!post) return res.status(404).json({message: "post not found"})

      return response(200, "success get post by id", post, res);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
};

export const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const updatedPost = req.body; // Data pembaruan pengguna dari permintaan PUT  

  try {
    const post = await Post.findByPk(postId);

    if(!post) return res.status(404).json({message: "post not found"})

    if (post) {
      await post.update(updatedPost);
      return response(200, "Success update pengguna", post, res)
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
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

// GET ALL APPLICANT BY POST
// GET ALL SAVED BY POST

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