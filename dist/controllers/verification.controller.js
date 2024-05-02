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
exports.VerifyVerificationCode = exports.SendVerificationEmail = void 0;
const Mailer_1 = __importDefault(require("../config/Mailer"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const VerificationCode_1 = __importDefault(require("../models/VerificationCode"));
dotenv.config();
const MAILER_EMAIL = process.env.MAILER_EMAIL;
const MAILER_NAME = process.env.MAILER_NAME;
const sendVerificationCodeToEmail = async (userEmail, verificationCode) => {
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
        <h3 class="header">Haloo, aku prediksi kamu baru daftar ya?</h3>
        <p>Cie.</p>
        <p>Ini kodenya yak:</p>
        <p class="header" style="color: #4a4a4a">${verificationCode}.</p>
        <p>Kalo ada apa2, email kita aja yak, tapi jangan reply kesini. Kirimnya ke <a href="hello@hup.co.id">hello@hup.co.id</a> ajah. Atau DM Instagram kita juga boleee 👍</p>
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
        subject: `${verificationCode} is your Hup! verification code`,
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
const SendVerificationEmail = async (req, res) => {
    const userEmail = req.query.email;
    const verificationCode = generateRandomNumber();
    try {
        sendVerificationCodeToEmail(userEmail, verificationCode);
        const USER = await VerificationCode_1.default.findOne({ where: {
                verification_email: userEmail
            } });
        if (!USER) {
            await VerificationCode_1.default.create({
                verification_email: userEmail,
                verification_code: verificationCode
            });
        }
        else {
            USER.update({
                verification_code: verificationCode
            });
        }
        return res.status(200).send({
            message: "Verification Code berhasil dikirim"
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.SendVerificationEmail = SendVerificationEmail;
const VerifyVerificationCode = async (req, res) => {
    const verification_email = req.body.email;
    const verification_code = req.body.code;
    try {
        const USER = await VerificationCode_1.default.findOne({ where: {
                verification_email: verification_email
            } });
        if (!USER)
            return res.status(400).json({ message: "Email Address Not Found !" });
        if (USER.verification_code !== verification_code)
            return res.status(400).json({ message: "Wrong Verification Code !" });
        if (USER.verification_code == verification_code) {
            return res.status(200).send({
                message: "Your Email Address was Successfuly Verified"
            });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.VerifyVerificationCode = VerifyVerificationCode;
function generateRandomNumber() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber.toString();
}
//# sourceMappingURL=verification.controller.js.map