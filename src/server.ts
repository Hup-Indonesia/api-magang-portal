import express, {Request, Response} from "express";
import fs from "fs"
import path from "path";
import multer from 'multer';
import cookieParser from "cookie-parser"
import cors from "cors"
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import * as dotenv from "dotenv";
import Seeker from "./models/Seeker";
import { createToken } from "./config/JWT";
import transporter from "./config/Mailer"
import helmet from "helmet";
dotenv.config();


const MAILER_EMAIL = process.env.MAILER_EMAIL
const MAILER_NAME = process.env.MAILER_NAME

const app = express();

// Konfigurasi Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `/api/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  // Lakukan sesuatu dengan data profil pengguna, seperti menyimpan di database
  const email = profile.emails![0].value;

  if (!email) {
    throw new Error('Login failed');
  }

  const existingUser = await Seeker.findOne({where: {email}});
  
  if(existingUser){
    const accessToken = createToken(existingUser);
    Object.assign(profile, {accessToken})
    return done(null, profile);
  }else{
    let SEEKER = await Seeker.create({
      first_name: profile.name.givenName,
      last_name: profile.name.familyName,
      email: profile.emails![0].value,
      profile_picture: profile.photos[0].value,
      role: "seeker"
    })
    const accessToken = createToken(SEEKER);
    Object.assign(profile, {accessToken})
    sendWelcomeEmail(profile.emails![0].value, profile.name.givenName)
    return done(null, profile);
  }
}));

app.use(passport.initialize());

app.get('/api/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' , session: false}),
  (req:Request, res: Response) => {
    // Di sini, Anda dapat mengarahkan pengguna atau melakukan sesuatu setelah otentikasi sukses
    res.cookie("access-token", req.user.accessToken, {
      maxAge: 360000000,
    });
    res.redirect("/seeker/profile")
  }
);








// for image upload
if (!fs.existsSync("public/files/uploads")) {
  if (!fs.existsSync("public/files")) {
    fs.mkdirSync("public/files");
  }
  if (!fs.existsSync("public/files/uploads")) {
    fs.mkdirSync("public/files/uploads");
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files/uploads");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, Date.now() + Math.floor(Math.random() * 99) + 1 + "." + extension);
  },
});

// Router import
import { connectToDatabase } from "./models";
import viewRouter from "./router/viewRouter";
import seekerRouter from "./router/seeker.router";
import recruiterRouter from "./router/recruiter.router";
import postRouter from "./router/post.router";
import seekerpostRouter from "./router/seekerpost.router";
import verificationRouter from "./router/verification.router";
import superRouter from "./router/super.router";
import authRouter from "./router/auth.router"

app.use(cors({credentials: true, origin: 'http://localhost:5173'}))
app.use(express.json());
app.use(cookieParser());
app.use(multer({ storage: storage, limits: { fileSize: 2097152 } }).any());
app.enable("trust proxy");
app.use(helmet());


const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "blob:", "lh3.googleusercontent.com"], // Menambahkan "blob:"
    scriptSrc: [
      "'self'",
      'code.jquery.com',
      'cdnjs.cloudflare.com',
      'cdn.datatables.net',
      "cdn.jsdelivr.net",
      "cdn.quilljs.com"
    ],
  },
};


// Aktifkan opsi HSTS untuk memaksa redirect dari HTTP ke HTTPS
app.use(
  helmet.hsts({
    maxAge: 31536000, // 1 tahun
    includeSubDomains: true,
    preload: true,
  })
);
app.use(helmet({
  xFrameOptions: { action: "deny" },
}));
app.use(helmet.contentSecurityPolicy(cspOptions));



// konfigurasi static item dalam public folder
app.use("/", express.static(path.join(__dirname, "../public")));

// konfigurasi view engine "EJS"
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// konfigurasi sequelize dengan option alter
let PORT = process.env.PORT || 8080;
connectToDatabase()
  .then(() => {
    // set router
    const VERSION_API = "v1";
    app.use("/", viewRouter);
    app.use(`/magang-portal/${VERSION_API}/seeker`, seekerRouter);
    app.use(`/magang-portal/${VERSION_API}/recruiter`, recruiterRouter);
    app.use(`/magang-portal/${VERSION_API}/posts`, postRouter);
    app.use(`/magang-portal/${VERSION_API}/seekerpost`, seekerpostRouter);
    app.use(`/magang-portal/${VERSION_API}/verification`, verificationRouter);
    app.use(`/magang-portal/${VERSION_API}/super`, superRouter);
    app.use(`/magang-portal/${VERSION_API}/auth`, authRouter);
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Koneksi database gagal:", error);
  });



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
