import { Request, Response } from "express";
import bcrypt from "bcrypt"
import Seeker from "../models/Seeker";
import path from "path";
import jwt from "jsonwebtoken"
import transporter from "../config/Mailer"
import * as dotenv from "dotenv";
dotenv.config();

const MAILER_EMAIL = process.env.MAILER_EMAIL
const MAILER_NAME = process.env.MAILER_NAME

export const Register = async (req: Request, res: Response) => {
    const seekerData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST

    if(!seekerData.first_name || !seekerData.last_name || !seekerData.email) return res.status(400).json({message: "first, last name and email cannot be empty"})

    seekerData.role = "seeker"
    try {
        hashPassword(seekerData.password)
            .then(async(hashedPassword) => {
                seekerData.password = hashedPassword
                let newSeeker = await Seeker.create(seekerData);
            
                const accessToken = jwt.sign({id: newSeeker.id},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: "15s"} 
                )

                const refreshToken = jwt.sign({id: newSeeker.id},
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn: "1d"} 
                )
    
                // sendWelcomeEmail(seekerData.email, seekerData.first_name)
                res.status(201).json({accessToken, refreshToken})
            })
            .catch((error) => {
                console.error("Gagal membuat pengguna:", error);
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        console.error("Gagal membuat pengguna:", error);
        res.status(500).json({ message: error.message });
    }
};

export const Login = async (req: Request, res: Response) => {
    const {email, password} = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    try {
        if(!email || !password) return res.status(400).json({message: "all field required"})
        
        let SEEKER = await Seeker.findOne({
            where: {
                email: email
            }
        })

        if(!SEEKER) return res.status(400).json({message: "user not found"})
        if(!SEEKER.password) return res.status(400).json({message: "wrong password"})

        const match = await bcrypt.compare(password, SEEKER.password)

        if(!match) return res.status(401).json({message: "wrong password"})

        const accessToken = jwt.sign({
                id: SEEKER.id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "15s"} 
        )

        const refreshToken = jwt.sign({
                id: SEEKER.id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "1d"} 
        )

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    
        res.json({accessToken, refreshToken})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const Refresh = async (req: Request, res:Response) => {
    const refreshToken = req.body.refreshToken
    try {
      if(!refreshToken) return res.status(400).json({message: "Dont have refresh token"})

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
          if(err) return res.status(400).json({message: "Unauthorized, refresh token invalid"})

          const foundUser = await Seeker.findOne({where: {id: decoded.id}})

          if(!foundUser) return res.status(400).json({message: "user not found on refresh token"})

          const accessToken = jwt.sign({
                  id: decoded.id
              },
              process.env.ACCESS_TOKEN_SECRET,
              {expiresIn: "15s"} 
          )

          res.json({accessToken})
      })
    } catch (error) {
      res.status(500).json({message: error.message})
    }

    
}

export const Logout = (req:Request, res:Response) => {
    const cookies = req.cookies
    if(!cookies?.refreshToken) return res.sendStatus(204)
    res.clearCookie("refreshToken")
    res.json({message: "cookie cleared"})
}








const hashPassword = async (plainPassword: string): Promise<string> => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password');
    }
};

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