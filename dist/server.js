"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv = __importStar(require("dotenv"));
const Seeker_1 = __importDefault(require("./models/Seeker"));
const JWT_1 = require("./config/JWT");
const Mailer_1 = __importDefault(require("./config/Mailer"));
const helmet_1 = __importDefault(require("helmet"));
dotenv.config();
const MAILER_EMAIL = process.env.MAILER_EMAIL;
const MAILER_NAME = process.env.MAILER_NAME;
const app = (0, express_1.default)();
// Konfigurasi Google OAuth
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `/api/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    // Lakukan sesuatu dengan data profil pengguna, seperti menyimpan di database
    const email = profile.emails[0].value;
    if (!email) {
        throw new Error('Login failed');
    }
    const existingUser = await Seeker_1.default.findOne({ where: { email } });
    if (existingUser) {
        const accessToken = (0, JWT_1.createToken)(existingUser);
        Object.assign(profile, { accessToken });
        return done(null, profile);
    }
    else {
        let SEEKER = await Seeker_1.default.create({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile.emails[0].value,
            profile_picture: profile.photos[0].value,
            role: "seeker"
        });
        const accessToken = (0, JWT_1.createToken)(SEEKER);
        Object.assign(profile, { accessToken });
        sendWelcomeEmail(profile.emails[0].value, profile.name.givenName);
        return done(null, profile);
    }
}));
app.use(passport_1.default.initialize());
app.get('/api/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
    // Di sini, Anda dapat mengarahkan pengguna atau melakukan sesuatu setelah otentikasi sukses
    res.cookie("access-token", req.user.accessToken, {
        maxAge: 360000000,
    });
    res.redirect("/seeker/profile");
});
// for image upload
if (!fs_1.default.existsSync("public/files/uploads")) {
    if (!fs_1.default.existsSync("public/files")) {
        fs_1.default.mkdirSync("public/files");
    }
    if (!fs_1.default.existsSync("public/files/uploads")) {
        fs_1.default.mkdirSync("public/files/uploads");
    }
}
const storage = multer_1.default.diskStorage({
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
const models_1 = require("./models");
const viewRouter_1 = __importDefault(require("./router/viewRouter"));
const seeker_router_1 = __importDefault(require("./router/seeker.router"));
const recruiter_router_1 = __importDefault(require("./router/recruiter.router"));
const post_router_1 = __importDefault(require("./router/post.router"));
const seekerpost_router_1 = __importDefault(require("./router/seekerpost.router"));
const verification_router_1 = __importDefault(require("./router/verification.router"));
const super_router_1 = __importDefault(require("./router/super.router"));
const auth_router_1 = __importDefault(require("./router/auth.router"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, multer_1.default)({ storage: storage, limits: { fileSize: 2097152 } }).any());
app.enable("trust proxy");
app.use((0, helmet_1.default)());
const cspOptions = {
    directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "lh3.googleusercontent.com"],
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
app.use(helmet_1.default.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
}));
app.use((0, helmet_1.default)({
    xFrameOptions: { action: "deny" },
}));
app.use(helmet_1.default.contentSecurityPolicy(cspOptions));
// konfigurasi static item dalam public folder
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../public")));
// konfigurasi view engine "EJS"
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views"));
// konfigurasi sequelize dengan option alter
let PORT = process.env.PORT || 8080;
(0, models_1.connectToDatabase)()
    .then(() => {
    // set router
    const VERSION_API = "v1";
    app.use("/", viewRouter_1.default);
    app.use(`/magang-portal/${VERSION_API}/seeker`, seeker_router_1.default);
    app.use(`/magang-portal/${VERSION_API}/recruiter`, recruiter_router_1.default);
    app.use(`/magang-portal/${VERSION_API}/posts`, post_router_1.default);
    app.use(`/magang-portal/${VERSION_API}/seekerpost`, seekerpost_router_1.default);
    app.use(`/magang-portal/${VERSION_API}/verification`, verification_router_1.default);
    app.use(`/magang-portal/${VERSION_API}/super`, super_router_1.default);
    app.use(`/magang-portal/${VERSION_API}/auth`, auth_router_1.default);
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
    const info = await Mailer_1.default.sendMail({
        from: `"${MAILER_NAME}" <${MAILER_EMAIL}>`,
        to: userEmail,
        subject: `Haloo ${userName}! Selamat bergabung`,
        html: emailHTML,
        attachments: [{
                filename: "Logo.png",
                path: path_1.default.resolve(__dirname + "/Logo.png"),
                cid: 'logo',
                contentDisposition: "inline"
            }]
    });
    console.log("Message sent: %s", info.messageId);
};
//# sourceMappingURL=server.js.map