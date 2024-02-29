import { Request, Response } from "express";
import response from "./response";
import path from "path";
import SeekerPost from "../models/SeekerPost";
import Waiting from "../models/Waiting";
import Reviewed from "../models/Reviewed";
import Scheduled from "../models/Scheduled";
import Rejected from "../models/Rejected";
import Offering from "../models/Offering";
import transporter from "../config/Mailer"
import * as dotenv from "dotenv";
dotenv.config();


export const getAllSeekerPost = async (req: Request, res: Response) => {
    try {
      let seekerpostQuery = req.query
      
      if(Object.keys(seekerpostQuery).length !== 0){
        const seekerpost = await SeekerPost.findAll({attributes:{exclude:["createdAt","updatedAt"]}, include:[
          {model:Waiting,attributes:{exclude:["createdAt","updatedAt"]}},
          {model:Reviewed,attributes:{exclude:["createdAt","updatedAt"]}},
          {model:Scheduled,attributes:{exclude:["createdAt","updatedAt"]}},
          {model:Rejected,attributes:{exclude:["createdAt","updatedAt"]}},
          {model:Offering,attributes:{exclude:["createdAt","updatedAt"]}},
        ], where: {
          PostId: seekerpostQuery.postid
        }});
        return response(200, "success call posts by query", seekerpost, res);
      }

      const seekerpost = await SeekerPost.findAll({attributes:{exclude:["createdAt","updatedAt"]}, include:[
        {model:Waiting,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Reviewed,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Scheduled,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Rejected,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Offering,attributes:{exclude:["createdAt","updatedAt"]}},
      ]});
      return response(200, "success call all posts", seekerpost, res);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      res.status(500).json({ error: "Server error" });
    }
};

export const getSeekerPostById = async (req: Request, res: Response) => {
    try {
      const seekerpost = await SeekerPost.findOne({where:{id:req.params.id},attributes:{exclude:["createdAt","updatedAt"]}, include:[
        {model:Waiting,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Reviewed,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Scheduled,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Rejected,attributes:{exclude:["createdAt","updatedAt"]}},
        {model:Offering,attributes:{exclude:["createdAt","updatedAt"]}},
      ]});
      if(seekerpost) return response(200, "success call posts", seekerpost, res);
      else return response(404, "SeekerPost not found", [], res)
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      res.status(500).json({ error: "Server error" });
    }
};

export const updateSeekerPost = async (req: Request, res: Response) => {
  let seekerpostId = req.params.id
  let seekerpostData = req.body
  
  try {
    const seekerpost = await SeekerPost.findByPk(seekerpostId);
    if (seekerpost) {
      await seekerpost.update(seekerpostData);

      if(req.body.applicantStatus == "Waiting"){
        sendApplyEmail(seekerpostData)
        await Waiting.create({
          waitingDate: getFormattedToday()
        }).then(function(waiting){
          seekerpost.setWaiting(waiting)
          seekerpost.setReviewed(null)
          seekerpost.setScheduled(null)
          seekerpost.setRejected(null)
          seekerpost.setOffering(null)
        })
      }

      if(req.body.applicantStatus == "Reviewed"){
        sendReviewEmail(seekerpostData)
        await Reviewed.create({
          reviewedDate: getFormattedToday()
        }).then(function(reviewed){
          seekerpost.setReviewed(reviewed)
        })
      }

      if(req.body.applicantStatus == "Scheduled"){
        sendInterviewEmail(seekerpostData)
        await Scheduled.create({
          scheduledDate: getFormattedToday()
        }).then(function(result){
          seekerpost.setScheduled(result)
        })
      }

      if(req.body.applicantStatus == "Rejected"){        
        sendRejectedEmail(seekerpostData)
        await Rejected.create({
          rejectedDate: getFormattedToday(),
          rejectedMessage: seekerpostData.rejectedMessage
        }).then(function(rejected){
          seekerpost.setRejected(rejected)
        })
      }

      if(req.body.applicantStatus == "Offering"){
        sendOfferingEmail(seekerpostData)
        await Offering.create({
          offeringDate: getFormattedToday()
        }).then(function(reviewed){
          seekerpost.setOffering(reviewed)
        })
      }


      return response(200, "Success update pengguna", seekerpost, res)
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateInterview = async (req: Request, res: Response) => {
  let interviewId = req.params.id
  let interviewData = req.body

  try {
    const scheduled = await Scheduled.findByPk(interviewId);
    if (scheduled) {
      interviewData.interviewDate = `${formatDate(interviewData.interviewDate[0])} • ${interviewData.interviewDate[1]} - ${interviewData.interviewDate[2]}`
      // await scheduled.update(interviewData);
      // sendJadwalEmail(interviewData)
      response(200, "Success update pengguna", scheduled, res)
    } else {
      res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memperbarui pengguna:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateOffering = async (req: Request, res: Response) => {
  let offeringId = req.params.id
  let offeringData = req.body

  try {
    const offering = await Offering.findByPk(offeringId);
    if (offering) {
      await offering.update(offeringData);
      response(200, "Success update pengguna", offering, res)
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

  // Mendapatkan jam dan menit dalam format 2-digit
  const hours: string = ('0' + today.getHours()).slice(-2);
  const minutes: string = ('0' + today.getMinutes()).slice(-2);

  // Mendapatkan tanggal, bulan (dalam format Jan), dan tahun
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const datePart: string = new Intl.DateTimeFormat('en-US', options).format(today);

  // Menggabungkan semua bagian untuk hasil akhir
  const formattedToday: string = `${hours}:${minutes} • ${datePart}`;

  return formattedToday;
}

function formatDate(inputDate) {
  // Parse tanggal dalam format "YYYY-MM-DD"
  const dateParts = inputDate.split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  // Daftar nama bulan
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  // Konversi komponen bulan ke nama bulan
  const formattedMonth = monthNames[parseInt(month, 10) - 1];
  // Gabungkan komponen-komponen dalam format yang diinginkan
  const formattedDate = `${day} ${formattedMonth} ${year}`;

  return formattedDate;
}


const MAILER_EMAIL = process.env.MAILER_EMAIL
const MAILER_NAME = process.env.MAILER_NAME


const sendApplyEmail = async (seekerpostData) => {
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
        <h3 class="header">🤩 CIEE BARU APPLY</h3>
        <p>Kalo kamu dapet email ini, artinya kamu udah berhasil daftar di loker ini nehh: </p>
        <div class="" style="display: flex; align-items: center; padding: 1rem 1.25rem; border-radius: 8px; background-color: #F6F6F6;gap: 1rem; width: 90%; margin: 1rem 0;">
            <img id="org-logo" src="cid:logoapply" alt="" style="object-fit: cover; height: 50px; width: 50px; border-radius:8px;margin:auto 0;">
            <div class="" style="margin:auto 1rem">
                <p style="font-weight: 700;margin:0;">${seekerpostData.post_position}</p>
                <p style="font-size: .8rem;font-weight: 700; color: #22222260;margin:0;">${seekerpostData.rec_org_name}</p>
            </div>
        </div>
        <p>Sekarang, tinggal nungguin recruiternya liat profile kamu. Nanti kita kabarin lagi koq.</p>
        <p style="font-weight: 700;">Sambil nunggu, KITA SARANIN SIH apply ke yang lain juga 😅</p>
        <p>Inget ya, kata om Waren Buffett “Jangan apply kerjaan di 1 perusahaan aja, banyakin, kan ada Hup!”</p>
        <p>TAPII untuk sekarang, kita baru bisa bantu kalian dengan mempertemukan kalian dengan pekerjaan pertama kalian 🫶</p>
        <p>Yuk cek loker lainnya lewat link ini:</p>
        <a href="https://hup.co.id/internships">
            <button style="padding: .75rem 1.5rem; border-radius: 8px; background-color: black; color: white; margin: 1rem 0; font-weight: 700; font-size: .8rem; cursor: pointer; display: flex; align-items: center; gap: .5rem;">Liat Loker Lain <i class="uil uil-arrow-right"></i></button>
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
    to: seekerpostData.user_email,
    subject: `Kamu berhasil apply nih!`,
    html: emailHTML,
    attachments:[{
      filename:"Logo.png",
      path: path.resolve(__dirname + "/Logo.png"),
      cid: 'logo',
      contentDisposition:"inline"
    },{
      filename:"LogoPerusahaan.png",
      path: seekerpostData.rec_org_logo,
      cid: 'logoapply',
      contentDisposition:"inline"
    }]
  });
  
  console.log("Message sent: %s", info.messageId);
};

const sendReviewEmail = async (seekerpostData) => {
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
        <h3 class="header">👀 Lamaran kamu baru diliat </h3>
        <p>Recruiter dari ${seekerpostData.rec_org_name} udah liat profil kamu!</p>
        <p>Kita sih minta mereka untuk ngasih respon secepat mungkin yeah.. Tapi setiap recruiter kan beda-beda. 😅🙏</p>
        <a href="https://hup.co.id/internships/applied">
            <button style="padding: .75rem 1.5rem; border-radius: 8px; background-color: black; color: white; margin: 1rem 0; font-weight: 700; font-size: .8rem; cursor: pointer; display: flex; align-items: center; gap: .5rem;">Liat Status Lamaran <i class="uil uil-arrow-right"></i></button>
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
    to: seekerpostData.user_email,
    subject: `Yayy, profile kamu sedang di review!`,
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

const sendInterviewEmail = async (seekerpostData) => {
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
        <h3 class="header">📅 KAMU MASUK TAHAP INTERVIEW</h3>
        <p>Selamat selimit!! Kamu maju ke tahap interview! 🤩</p>
        <p>Ayo cepat lihat detailnya:</p>
        <a href="https://hup.co.id/internships/applied">
            <button style="padding: .75rem 1.5rem; border-radius: 8px; background-color: black; color: white; margin: 1rem 0; font-weight: 700; font-size: .8rem; cursor: pointer; display: flex; align-items: center; gap: .5rem;">Liat Status Lamaran <i class="uil uil-arrow-right"></i></button>
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
    to: seekerpostData.user_email,
    subject: `Wow! kamu masuk tahap interview`,
    html: emailHTML,
    attachments:[{
      filename:"Logo.png",
      path: path.resolve(__dirname + "/Logo.png"),
      cid: 'logo',
      contentDisposition:"inline"
    },{
      filename:"LogoPerusahaan.png",
      path: seekerpostData.rec_org_logo,
      cid: 'logoapply',
      contentDisposition:"inline"
    }]
  });
  
  console.log("Message sent: %s", info.messageId);
};

const sendOfferingEmail = async (seekerpostData) => {
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
        <h3 class="header">📬 WOW Selamat!!, kamu masuk tahap berikutnya!</h3>
        <p>Kamu masuk ke tahapan berikutnya, stay tuned info terbaru dari recruiternya yeah!</p>
        <div class="" style="display: flex; align-items: center; padding: 1rem 1.25rem; border-radius: 8px; background-color: #F6F6F6;gap: 1rem; width: 90%; margin: 1rem 0;">
            <img id="org-logo" src="cid:logoapply" alt="" style="object-fit: cover; height: 50px; width: 50px; border-radius:8px;margin:auto 0;">
            <div class="" style="margin:auto 1rem">
                <p style="font-weight: 700;margin:0;">${seekerpostData.post_position}</p>
                <p style="font-size: .8rem;font-weight: 700; color: #22222260;margin:0;">${seekerpostData.rec_org_name}</p>
            </div>
        </div>
        <a href="https://hup.co.id/internships/applied">
            <button style="padding: .75rem 1.5rem; border-radius: 8px; background-color: black; color: white; margin: 1rem 0; font-weight: 700; font-size: .8rem; cursor: pointer; display: flex; align-items: center; gap: .5rem;">Liat Status Lamaran <i class="uil uil-arrow-right"></i></button>
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
    to: seekerpostData.user_email,
    subject: `Kamu lolos tahap berikutnya!!`,
    html: emailHTML,
    attachments:[{
      filename:"Logo.png",
      path: path.resolve(__dirname + "/Logo.png"),
      cid: 'logo',
      contentDisposition:"inline"
    },{
      filename:"LogoPerusahaan.png",
      path: seekerpostData.rec_org_logo,
      cid: 'logoapply',
      contentDisposition:"inline"
    }]
  });
  
  console.log("Message sent: %s", info.messageId);
};

const sendRejectedEmail = async (seekerpostData) => {
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
        <h3 class="header">Maaf banget kamu belum lolos 😔</h3>
        <p>Kita punya kabar buruk, maaf banget kamu belom lolos jadi ${seekerpostData.post_position} di ${seekerpostData.rec_org_name}</p>
        <p>Tapi jangan patah semangat, ayo cari lowongan lainnya, lewat link di bawah!</p>
        <a href="https://hup.co.id/internships/applied">
            <button style="padding: .75rem 1.5rem; border-radius: 8px; background-color: black; color: white; margin: 1rem 0; font-weight: 700; font-size: .8rem; cursor: pointer; display: flex; align-items: center; gap: .5rem;">Liat Loker Lain <i class="uil uil-arrow-right"></i></button>
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
    to: seekerpostData.user_email,
    subject: `Maaf banget kami bawa kabar buruk :(`,
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

const sendJadwalEmail = async (interviewData) => {
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
        <h3 class="header">📅 JADWAL INTERVIEW KAMU UDAH DITENTUIN !!</h3>
        <p>Kamu ada interview ${interviewData.interviewType} di tanggal ${interviewData.interviewDate} loh!!, ayo cepet cek detailnya lewat link dibawah!</p>
        <a href="https://hup.co.id/internships/applied">
            <button style="padding: .75rem 1.5rem; border-radius: 8px; background-color: black; color: white; margin: 1rem 0; font-weight: 700; font-size: .8rem; cursor: pointer; display: flex; align-items: center; gap: .5rem;">Liat Status Lamaran <i class="uil uil-arrow-right"></i></button>
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
    to: interviewData.seeker_email,
    subject: `Heyy, udah ditentuin nih jadwal interview kamu!`,
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
