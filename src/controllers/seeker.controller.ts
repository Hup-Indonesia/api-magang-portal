import { Request, Response } from "express";
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
import Post from "../models/Post";
import transporter from "../config/Mailer"
import * as dotenv from "dotenv";
dotenv.config();


// Fungsi ini mengambil semua pengguna
export const getAllSeeker = async (req: Request, res: Response) => {
  try {

    let page = req.query.page || 1
    let limit = req.query.limit || 9999

    let startIndex = (+page - 1) * +limit
    let endIndex = +page * +limit
    

    const seeker = await Seeker.findAll({attributes:{exclude:["createdAt","updatedAt","password"]}, include:[
      {model:Experience, as:"experiences", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Education, as:"educations", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Attachment, as:"attachment", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Post, as:"applied", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Post, as:"saved", attributes:{exclude:["createdAt","updatedAt"]}},
    ]});
    const result = seeker.slice(startIndex, endIndex)
    response(200, "success call all seeker", result, res);
  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fungsi ini mengambil satu pengguna berdasarkan ID
export const getSeekerById = async (req: Request, res: Response) => {
  const seekerId = req.params.id;

  try {
    const mahasiswa = await Seeker.findByPk(seekerId,{attributes:{exclude:["createdAt","updatedAt","password"]}, include:[
      {model:Experience, as:"experiences", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Education, as:"educations", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Attachment, as:"attachment", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Recruiter, as:"recruiter", attributes:{exclude:["createdAt","updatedAt"]}},
      {model:Post, as:"applied", attributes:{exclude:["createdAt","updatedAt"]},include:[
        {model:Recruiter, as: "recruiter",attributes:{exclude:["createdAt","updatedAt","ownerId"]}, through:{attributes:[]}},
      ]},
      {model:Post, as:"saved", attributes:{exclude:["createdAt","updatedAt"]}, include:[
        {model:Recruiter, as: "recruiter",attributes:{exclude:["createdAt","updatedAt","ownerId"]}, through:{attributes:[]}},
        {model:Seeker, as: "applicants",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
        {model:Seeker, as: "saved",attributes:{exclude:["createdAt","updatedAt","ownerId"]}},
      ]},
    ]});
    if (mahasiswa) {
      response(200, `Success get customer by id`, mahasiswa, res)
    } else {
      response(404, "Seeker not found", [], res)
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi ini membuat pengguna baru
export const createSeeker = async (req: Request, res: Response) => {
  const seekerData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
  seekerData.role = "seeker"
  try {
    hashPassword(seekerData.password)
      .then(async(hashedPassword) => {
        seekerData.password = hashedPassword
        let newSeeker = await Seeker.create(seekerData);
        // Membut cookies untuk login
        const accessToken = createToken(newSeeker);
        res.cookie("access-token", accessToken, {
          maxAge: 3600000,
        });

        // HERE
        sendWelcomeEmail(seekerData.email, seekerData.first_name)
        

        response(201, "success create new users", newSeeker, res)
      })
      .catch((error) => {
        console.error("Gagal membuat pengguna:", error);
        res.status(500).json({ error: "Server error" });
      });
  } catch (error) {
    console.error("Gagal membuat pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const loginSeeker = async (req: Request, res: Response) => {
  const seekerData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
  try {
    let seeker = await Seeker.findOne({
      where: {
        email: seekerData.email
      }
    })
    
    if (!seeker) return response(400, "seeker not found", [], res)
    bcrypt.compare(seekerData.password, seeker.password).then((match) => {
      if (!match) {
        return res.json({ error: "wrong username and password combination" });
      } else {
        const accessToken = createToken(seeker);
        res.cookie("access-token", accessToken, {
          maxAge: 360000000,
        });
        return response(200, "success login", seeker, res)
      }
    });
  } catch (error) {
    console.error("Gagal login pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const logoutSeeker = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access-token");
    res.redirect("/");
  } catch (error) {
    console.error("Gagal logout pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Fungsi ini memperbarui pengguna berdasarkan ID
export const updateSeeker = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const updatedSeeker = req.body; // Data pembaruan pengguna dari permintaan PUT  

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {

      // Menambahakan URL Image ke dalam gambar, 
      // dan menghapus gambar lama ketika upload gambar baru
      if(req.files.length !== 0){
        if(seeker.profile_picture){
          const fileToDelete = `public/files/uploads/${seeker.profile_picture.split("uploads/")[1]}`
          if (fs.existsSync(fileToDelete)) {
            try {
              fs.unlinkSync(fileToDelete);
              console.log(`File ${seeker.profile_picture.split("uploads/")[1]} deleted successfully.`);
            } catch (err) {
              console.error(`Error deleting file ${seeker.profile_picture.split("uploads/")[1]}: ${err}`);
            }
          } else {
            console.log(`File ${seeker.profile_picture.split("uploads/")[1]} not found.`);
          } 
        }
        req.body.profile_picture = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`
      }
      
      await seeker.update(updatedSeeker);
      response(200, "Success update pengguna", seeker, res)
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fungsi ini menghapus pengguna berdasarkan ID
export const deleteSeeker = async (req: Request, res: Response) => {
  const seekerId = req.params.id;

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      await seeker.destroy();
      res.status(204).end(); // Mengembalikan 204 No Content jika pengguna berhasil dihapus
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal menghapus pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};



// EXPERIENCES

// Fungsi ini membuat experience pengguna berdasarkan ID
export const addExperience = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const experienceData = req.body; // Data pembaruan pengguna dari permintaan PUT

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      await Experience.create(experienceData).then(async function(result){
        await seeker.addExperience(result)
        response(200, "Success update pengguna", seeker, res)
      })
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const deletionId = req.params.deletionId

  try {
    const seeker = await Seeker.findByPk(seekerId);
    
    if (seeker) {
      // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
      const experience = await seeker.getExperiences({ where: { id: deletionId } });
      if (experience.length > 0) {
        // Jika pengalaman ditemukan, hapus pengalaman tersebut
        seeker.removeExperience(experience)
        await Experience.destroy({ where: { id: deletionId } });
        response(200, "Pengalaman berhasil dihapus", seeker, res);
      } else {
        res.status(404).json({ error: "Experience tidak ditemukan" });
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const updateId = req.params.updateId

  try {
    const seeker = await Seeker.findByPk(seekerId);
    
    if (seeker) {
      // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
      const experience = await seeker.getExperiences({ where: { id: updateId } });
      if (experience.length > 0) {

        if (req.body.exp_enddate == null) req.body.exp_enddate = null
        
        await Experience.update(req.body,{ where: { id: updateId } });
        response(200, "Education berhasil diupdate", seeker, res);
      } else {
        res.status(404).json({ error: "Education tidak ditemukan" });
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// EDUCATION

// Fungsi ini membuat education pengguna berdasarkan ID
export const addEducation = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const educationData = req.body; // Data pembaruan pengguna dari permintaan PUT

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      await Education.create(educationData).then(async function(result){
        await seeker.addEducation(result)
        response(200, "Success update pengguna", seeker, res)
      })
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteEducation = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const deletionId = req.params.deletionId

  try {
    const seeker = await Seeker.findByPk(seekerId);
    
    if (seeker) {
      // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
      const education = await seeker.getEducations({ where: { id: deletionId } });
      if (education.length > 0) {
        // Jika pengalaman ditemukan, hapus pengalaman tersebut
        seeker.removeEducation(education)
        await Education.destroy({ where: { id: deletionId } });
        response(200, "Education berhasil dihapus", seeker, res);
      } else {
        res.status(404).json({ error: "Education tidak ditemukan" });
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const updateId = req.params.updateId

  try {
    const seeker = await Seeker.findByPk(seekerId);
    
    if (seeker) {
      // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
      const education = await seeker.getEducations({ where: { id: updateId } });
      if (education.length > 0) {
        await Education.update(req.body,{ where: { id: updateId } });
        response(200, "Education berhasil diupdate", seeker, res);
      } else {
        res.status(404).json({ error: "Education tidak ditemukan" });
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// ATTACHMENT
export const setAttachment = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const attachmentData = req.body; // Data pembaruan pengguna dari permintaan PUT

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      // if user upload file resume
      let attachment = (await seeker.getAttachment())

      attachmentData.atc_resume = attachment ? attachment.atc_resume : null

      if(req.files.length !== 0){
        if(attachment){
          if(attachment.atc_resume){
            const filename = attachment.atc_resume.split("/uploads")[1]
            const fileToDelete = `public/files/uploads/${filename}`
            if (fs.existsSync(fileToDelete)) {
              try {
                fs.unlinkSync(fileToDelete);
                console.log(`File ${filename} deleted successfully.`);
              } catch (err) {
                console.error(`Error deleting file ${filename}: ${err}`);
              }
            } else {
              console.log(`File ${filename} not found.`);
            } 
          }
        }
        
        attachmentData.atc_resume = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`
      }
      
      // check if attachment not null delete previous data
      let attachmentId = attachment ? attachment.id : null
      
      if(attachmentId){
        await Attachment.update(attachmentData,{where:{id:attachmentId}})
        response(200, "Success update attachment", seeker, res)
      }else{
        // create new attachment
        await Attachment.create(attachmentData).then(async function(result){
          await seeker.setAttachment(result)
          response(200, "Success update pengguna", seeker, res)
        })
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAttachment = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const fieldName = req.params.fieldName

  try {
    const seeker = await Seeker.findByPk(seekerId);
    
    if (seeker) {
      // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
      const attachmentData = (await seeker.getAttachment());
      if (attachmentData) {
        if (attachmentData[fieldName]) {
          attachmentData[fieldName] = null;
          await attachmentData.save()
          response(200, `${fieldName} berhasil dihapus`, seeker, res);
        } else {
          res.status(404).json({ error: `${fieldName} tidak ditemukan` });
        }
      } else {
        res.status(404).json({ error: "Attachment tidak ditemukan" });
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Recruiter Register
export const addRecruiter = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const recruiterData = req.body; // Data pembaruan pengguna dari permintaan PUT
  

  try {
    const seeker = await Seeker.findByPk(seekerId);
    if (seeker) {
      await Recruiter.create(recruiterData).then(async function(result){
        await seeker.setRecruiter(result)
        seeker.update({role:"recruiter"})
        response(200, "Success update pengguna", seeker, res)
      })
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};




export const addSavedPost = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const recruiterData = req.body; // Data pembaruan pengguna dari permintaan PUT
  

  try {
    const seeker = await Seeker.findByPk(seekerId);
    const post = await Post.findByPk(recruiterData.post_id)
    
    if (seeker) {
      if(recruiterData.loved == "true"){
        seeker.addSaved(post)
        return response(200, "Success update pengguna", [], res)
      }else{
        seeker.removeSaved(post)
        return response(200, "Success hapus post", [], res)
      }
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Seeker Apply Post
export const addApplied = async (req: Request, res: Response) => {
  const seekerId = req.params.id;
  const postId = req.params.postId
  const seekerData = req.body; // Data pembaruan pengguna dari permintaan PUT


  try {
    const seeker = await Seeker.findByPk(seekerId);
    const post = await Post.findByPk(postId)
    
    let attachment = (await seeker.getAttachment())
    seekerData.atc_resume = attachment ? attachment.atc_resume : null

    if(req.files.length !== 0){
      if(attachment){
        if(attachment.atc_resume){
          const filename = attachment.atc_resume.split("/uploads")[1]
          const fileToDelete = `public/files/uploads/${filename}`
          if (fs.existsSync(fileToDelete)) {
            try {
              fs.unlinkSync(fileToDelete);
              console.log(`File ${filename} deleted successfully.`);
            } catch (err) {
              console.error(`Error deleting file ${filename}: ${err}`);
            }
          } else {
            console.log(`File ${filename} not found.`);
          } 
        }
      }
      
      seekerData.atc_resume = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`
    }
    let attachmentId = attachment ? attachment.id : null

    if (seeker) {
      if(attachmentId){
        await Attachment.update(seekerData,{where:{id:attachmentId}})
      }else{
        // create new attachment
        await Attachment.create(seekerData).then(async function(result){
          await seeker.setAttachment(result)
        })
      }

      await seeker.addApplied(post)
      let applied = await seeker.getApplied({where:{id:postId}})

      return res.send(applied[0])

    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};

function getFormattedToday(): string {
  const today: Date = new Date();

  const year: number = today.getFullYear();
  let month: number | string = today.getMonth() + 1;
  let day: number | string = today.getDate();

  // Padding digit bulan dan tanggal dengan '0' jika diperlukan
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  // Menggabungkan tahun, bulan, dan tanggal dengan format yang diinginkan
  const formattedToday: string = `${year}-${month}-${day}`;

  return formattedToday;
}



const MAILER_EMAIL = process.env.MAILER_EMAIL
const MAILER_NAME = process.env.MAILER_NAME



const sendWelcomeEmail = async (userEmail, userName) => {
  const emailHTML = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        .header{
            font-size: 20px;
            font-weight: 800;
            margin: 2rem 0;
        }
        .body{
            padding: 2rem;
            background-color: #e0e0e0;
        }
        .email-container{
          padding: 2rem; width: 45%; margin: 0 auto; background-color: white; border-radius: 16px;
        }
        @media only screen and (max-width: 800px) {
          .email-container {
            width: 100%;
            border-radius: 0;
            padding: 1rem;
          }
          .body{
            padding: 0;
          }
        }
      </style>
      <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css">
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    
    <body class="body">
      <div class="email-container">
        <img src="cid:logo" alt="Logo Perusahaan Hup" width="80px">
        <h3 class="header">👋 Hiiiii, ${userName}!</h3>
        <p>Selamat bergabung di tempatnya para mahasiswa dan freshgrads ngumpul!!!!!</p>
        <p>Kalo kamu dapet email ini artinya kamu udah resmi jadi anggota komunitas kita</p>
        <p>Misi kita besar, kita pengen jadi jembatan buat anak muda bertransisi ke kehidupan dewasa.</p>
        <p>TAPII untuk sekarang, kita baru bisa bantu kalian dengan mempertemukan kalian dengan pekerjaan pertama kalian 🫶</p>
        <p style="font-weight: 700;">Stay tuned on our Instagram kalau mau lebih deket sama kita yeah! </p>
        <a href="https://www.instagram.com/ayohup/"">
            <button style="padding: .75rem 1.5rem; border-radius: 8px; background-color: black; color: white; margin: 1rem 0; font-weight: 700; font-size: .8rem; cursor: pointer; display: flex; align-items: center; gap: .5rem;">Lihat Instagram Hup! <i class="uil uil-arrow-right"></i></button>
        </a>
        <p>
            <span style="font-weight: 500; color: #343434;">Best Regards,</span> <br>
            <span style="font-weight: 700; color: #343434">Tim Kece Hup!</span>
        </p>
      </div>
    </body>
  </html>
  `;
  const info = await transporter.sendMail({
    from: `"${MAILER_NAME}" <${MAILER_EMAIL}>`, // sender address
    to: userEmail,
    subject: `Haloo ${userName}! Selamat bergabung`,
    html: emailHTML,
    attachments:[{
      filename:"Logo.png",
      path: path.resolve(__dirname + "/Logo.png"),
      cid: 'logo',
      contentDisposition:"inline"
    }]
  });
  
  console.log("Message sent: %s", info.messageId);
};