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
exports.Logout = exports.Refresh = exports.Login = exports.Register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Seeker_1 = __importDefault(require("../models/Seeker"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Mailer_1 = __importDefault(require("../config/Mailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const MAILER_EMAIL = process.env.MAILER_EMAIL;
const MAILER_NAME = process.env.MAILER_NAME;
const Register = async (req, res) => {
    const seekerData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    if (!seekerData.first_name || !seekerData.last_name || !seekerData.email)
        return res.status(400).json({ message: "first, last name and email cannot be empty" });
    seekerData.role = "seeker";
    try {
        hashPassword(seekerData.password)
            .then(async (hashedPassword) => {
            seekerData.password = hashedPassword;
            let newSeeker = await Seeker_1.default.create(seekerData);
            const accessToken = jsonwebtoken_1.default.sign({ id: newSeeker.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
            const refreshToken = jsonwebtoken_1.default.sign({ id: newSeeker.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            // sendWelcomeEmail(seekerData.email, seekerData.first_name)
            res.status(201).json({ accessToken });
        })
            .catch((error) => {
            console.error("Gagal membuat pengguna:", error);
            res.status(500).json({ error: error.message });
        });
    }
    catch (error) {
        console.error("Gagal membuat pengguna:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.Register = Register;
const Login = async (req, res) => {
    const { email, password } = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    try {
        if (!email || !password)
            return res.status(400).json({ message: "all field required" });
        let SEEKER = await Seeker_1.default.findOne({
            where: {
                email: email
            }
        });
        if (!SEEKER)
            return res.status(400).json({ message: "user not found" });
        if (!SEEKER.password)
            return res.status(400).json({ message: "wrong password" });
        const match = await bcrypt_1.default.compare(password, SEEKER.password);
        if (!match)
            return res.status(401).json({ message: "wrong password" });
        const accessToken = jsonwebtoken_1.default.sign({
            id: SEEKER.id
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
        const refreshToken = jsonwebtoken_1.default.sign({
            id: SEEKER.id
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.Login = Login;
const Refresh = async (req, res) => {
    const cookies = req.cookies;
    try {
        if (!cookies?.refreshToken)
            return res.status(400).json({ message: "Dont have refresh token" });
        const refreshToken = cookies.refreshToken;
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err)
                return res.status(400).json({ message: "Unauthorized, refresh token invalid" });
            const foundUser = await Seeker_1.default.findOne({ where: { id: decoded.id } });
            if (!foundUser)
                return res.status(400).json({ message: "user not found on refresh token" });
            const accessToken = jsonwebtoken_1.default.sign({
                id: decoded.id
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
            res.json({ accessToken });
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.Refresh = Refresh;
const Logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
        return res.sendStatus(204);
    res.clearCookie("refreshToken");
    res.json({ message: "cookie cleared" });
};
exports.Logout = Logout;
const hashPassword = async (plainPassword) => {
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(plainPassword, salt);
        return hashedPassword;
    }
    catch (error) {
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
//# sourceMappingURL=auth.controller.js.map