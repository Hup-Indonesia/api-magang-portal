import { Request, Response } from "express";
import transporter from "../config/Mailer"
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

const MAILER_EMAIL = process.env.MAILER_EMAIL
const MAILER_NAME = process.env.MAILER_NAME

const sendVerificationEmail = async (userEmail, verificationCode) => {
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
  const info = await transporter.sendMail({
    from: `"${MAILER_NAME}" <${MAILER_EMAIL}>`, // sender address
    to: userEmail,
    subject: `${verificationCode} is your Hup! verification code`,
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

export const SendVerification = async (req: Request, res: Response) => {
  const userEmail = req.params.email
  const verificationCode = generateRandomNumber();
  sendVerificationEmail(userEmail, verificationCode)
  res.send(verificationCode)
};


function generateRandomNumber() {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return randomNumber.toString();
}
