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
exports.checkEmailIsUsed = exports.getAllAppliedPostBySeekerId = exports.addApplied = exports.getAllSavedPostBySeekerId = exports.addSavedPost = exports.addRecruiter = exports.deleteAttachment = exports.setAttachment = exports.getAttachmentBySeekerId = exports.getEducationsBySeekerId = exports.addEducation = exports.addExperience = exports.getExperienceBySeekerId = exports.deleteSeeker = exports.forgetPasswordWithEmail = exports.updateSeeker = exports.getSeekerById = exports.getAllSeeker = void 0;
const Seeker_1 = __importDefault(require("../models/Seeker"));
const Experience_1 = __importDefault(require("../models/Experience"));
const Education_1 = __importDefault(require("../models/Education"));
const response_1 = __importDefault(require("./response"));
const bcrypt = __importStar(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const Attachment_1 = __importDefault(require("../models/Attachment"));
const path_1 = __importDefault(require("path"));
const Recruiter_1 = __importDefault(require("../models/Recruiter"));
const Post_1 = __importDefault(require("../models/Post"));
const Mailer_1 = __importDefault(require("../config/Mailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Fungsi ini mengambil semua pengguna
const getAllSeeker = async (req, res) => {
    try {
        let db_page = req.query.page || 1;
        let db_limit = req.query.limit || 20;
        const seeker = await Seeker_1.default.findAll({
            limit: +db_limit,
            offset: (+db_page - 1) * +db_limit,
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });
        const total_page = Math.ceil(await Seeker_1.default.count() / +db_limit);
        return res.status(200).json({
            status_code: 200,
            message: "success call all seeker",
            limit: db_limit,
            page: db_page,
            total_page,
            datas: seeker,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllSeeker = getAllSeeker;
// Fungsi ini mengambil satu pengguna berdasarkan ID
const getSeekerById = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const mahasiswa = await Seeker_1.default.findByPk(seekerId, {
            attributes: { exclude: ["createdAt", "updatedAt", "password"] }
        });
        if (!mahasiswa)
            return res.status(404).json({ message: "seeker not found" });
        return (0, response_1.default)(200, `success get customer by id`, mahasiswa, res);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getSeekerById = getSeekerById;
// Fungsi ini memperbarui pengguna berdasarkan ID
const updateSeeker = async (req, res) => {
    const seekerId = req.params.id;
    const updatedSeeker = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (req.files) {
            updatedSeeker.profile_picture = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
        }
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        if (seeker) {
            await seeker.update(updatedSeeker);
            (0, response_1.default)(200, "success update pengguna", seeker, res);
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.updateSeeker = updateSeeker;
const forgetPasswordWithEmail = async (req, res) => {
    const updatedSeeker = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        if (!updatedSeeker.email)
            return res.status(400).json({ message: "email required" });
        if (!updatedSeeker.password)
            return res.status(400).json({ message: "password required" });
        const seeker = await Seeker_1.default.findOne({
            where: {
                email: updatedSeeker.email,
            },
        });
        if (!seeker)
            return res.status(404).json({ message: "seeker not found !" });
        if (seeker) {
            hashPassword(updatedSeeker.password)
                .then(async (hashedPassword) => {
                await seeker.update({ password: hashedPassword });
                return res
                    .status(200)
                    .json({ message: "success update user password" });
            })
                .catch((error) => {
                console.error("Gagal membuat pengguna:", error);
                return res.status(500).json({ error: error.message });
            });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        return res.status(500).json({ error: error.message });
    }
};
exports.forgetPasswordWithEmail = forgetPasswordWithEmail;
// Fungsi ini menghapus pengguna berdasarkan ID
const deleteSeeker = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        if (seeker) {
            await seeker.destroy();
            return res.status(204).end(); // Mengembalikan 204 No Content jika pengguna berhasil dihapus
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteSeeker = deleteSeeker;
const hashPassword = async (plainPassword) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    }
    catch (error) {
        throw new Error("Error hashing password");
    }
};
// EXPERIENCES
// Fungsi ini membuat experience pengguna berdasarkan ID
const getExperienceBySeekerId = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        const EXPERIENCES = await seeker.getExperiences();
        return (0, response_1.default)(200, "success get all experience from some seeker", EXPERIENCES, res);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getExperienceBySeekerId = getExperienceBySeekerId;
const addExperience = async (req, res) => {
    const seekerId = req.params.id;
    const experienceData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            await Experience_1.default.create(experienceData).then(async function (result) {
                await seeker.addExperience(result);
                (0, response_1.default)(200, "Success update pengguna", seeker, res);
            });
        }
        else {
            res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addExperience = addExperience;
// EDUCATION
// Fungsi ini membuat education pengguna berdasarkan ID
const addEducation = async (req, res) => {
    const seekerId = req.params.id;
    const educationData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            await Education_1.default.create(educationData).then(async function (result) {
                await seeker.addEducation(result);
                (0, response_1.default)(200, "Success update pengguna", seeker, res);
            });
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.addEducation = addEducation;
const getEducationsBySeekerId = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        const EDUCATIONS = await seeker.getEducations();
        return (0, response_1.default)(200, "success get all educations from some seeker", EDUCATIONS, res);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getEducationsBySeekerId = getEducationsBySeekerId;
// ATTACHMENT
const getAttachmentBySeekerId = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        const ATTACHMENT = await seeker.getAttachment({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });
        return (0, response_1.default)(200, "success get attachment", ATTACHMENT, res);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getAttachmentBySeekerId = getAttachmentBySeekerId;
const setAttachment = async (req, res) => {
    const seekerId = req.params.id;
    const attachmentData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        if (seeker) {
            // if user upload file resume
            let attachment = await seeker.getAttachment();
            attachmentData.atc_resume = attachment
                ? attachment.atc_resume
                : null;
            if (req.files.length !== 0) {
                attachmentData.atc_resume = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
            }
            // check if attachment not null delete previous data
            let attachmentId = attachment ? attachment?.id : null;
            if (attachment) {
                await Attachment_1.default.update(attachmentData, {
                    where: { id: attachmentId },
                });
                return (0, response_1.default)(200, "Success update attachment", seeker, res);
            }
            else {
                // create new attachment
                await Attachment_1.default.create(attachmentData).then(async function (result) {
                    await seeker.setAttachment(result);
                    return (0, response_1.default)(200, "Success membuat attachment baru", seeker, res);
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.setAttachment = setAttachment;
const deleteAttachment = async (req, res) => {
    const seekerId = req.params.id;
    const attachmentBody = req.body;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const attachmentData = await seeker.getAttachment();
            if (!attachmentData)
                return res
                    .status(404)
                    .json({ message: "attachment not found" });
            if (attachmentData) {
                attachmentData.update(attachmentBody);
                return (0, response_1.default)(200, "success delete attachment field", [], res);
            }
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.deleteAttachment = deleteAttachment;
// Recruiter Register
const addRecruiter = async (req, res) => {
    const seekerId = req.params.id;
    const recruiterData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        if (seeker) {
            await Recruiter_1.default.create(recruiterData).then(async function (result) {
                await seeker.setRecruiter(result);
                seeker.update({ role: "recruiter" });
                (0, response_1.default)(200, "Success update pengguna", seeker, res);
            });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.addRecruiter = addRecruiter;
const addSavedPost = async (req, res) => {
    const seekerId = req.params.id;
    const recruiterData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        const post = await Post_1.default.findByPk(recruiterData.post_id);
        if (seeker) {
            if (recruiterData.loved == "true") {
                seeker.addSaved(post);
                return (0, response_1.default)(200, "Success update pengguna", [], res);
            }
            else {
                seeker.removeSaved(post);
                return (0, response_1.default)(200, "Success hapus post", [], res);
            }
        }
        else {
            res.status(404).json({ message: "seeker not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addSavedPost = addSavedPost;
const getAllSavedPostBySeekerId = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        const SAVED_POST = await seeker.getSaved({
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                {
                    model: Recruiter_1.default,
                    as: "recruiter",
                    attributes: [
                        "id",
                        "rec_org_name",
                        "rec_org_website",
                        "rec_org_logo",
                        "rec_mode",
                    ],
                    through: { attributes: [] },
                },
            ],
        });
        return (0, response_1.default)(200, "success get all saved post", SAVED_POST, res);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getAllSavedPostBySeekerId = getAllSavedPostBySeekerId;
// Seeker Apply Post
const addApplied = async (req, res) => {
    const seekerId = req.params.id;
    const postId = req.params.postId;
    const seekerData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        const post = await Post_1.default.findByPk(postId);
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        let attachment = await seeker.getAttachment();
        seekerData.atc_resume = attachment ? attachment.atc_resume : null;
        if (req.files.length !== 0) {
            seekerData.atc_resume = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
        }
        let attachmentId = attachment ? attachment.id : null;
        if (seeker) {
            if (attachmentId) {
                await Attachment_1.default.update(seekerData, {
                    where: { id: attachmentId },
                });
            }
            else {
                // create new attachment
                await Attachment_1.default.create(seekerData).then(async function (result) {
                    await seeker.setAttachment(result);
                });
            }
            await seeker.addApplied(post);
            let applied = await seeker.getApplied({ where: { id: postId } });
            return res.send(applied[0]);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addApplied = addApplied;
const getAllAppliedPostBySeekerId = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });
        const APPLIED_POST = await seeker.getApplied({
            attributes: {
                exclude: [
                    "post_deadline",
                    "post_postdate",
                    "post_view",
                    "post_need",
                    "post_link",
                    "post_mode",
                    "post_resume_req",
                    "post_portfolio_req",
                    "post_overview",
                    "post_responsibility",
                    "post_requirement",
                    "createdAt",
                    "updatedAt",
                ],
            },
            include: [
                {
                    model: Recruiter_1.default,
                    as: "recruiter",
                    attributes: [
                        "rec_org_name",
                        "rec_org_website",
                        "rec_org_logo",
                        "rec_mode",
                    ],
                    through: { attributes: [] },
                },
            ],
        });
        return (0, response_1.default)(200, "success get all applied post", APPLIED_POST, res);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getAllAppliedPostBySeekerId = getAllAppliedPostBySeekerId;
const checkEmailIsUsed = async (req, res) => {
    const emailData = req.body.email;
    try {
        if (!validator_1.default.isEmail(emailData))
            return res.status(400).json({ message: "Email Invalid" });
        let SEEKER = await Seeker_1.default.findOne({
            where: {
                email: emailData
            }
        });
        if (SEEKER)
            return res.status(400).json({ message: "Email Already Used" });
        return res.status(200).json({ message: "Email Valid" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.checkEmailIsUsed = checkEmailIsUsed;
const MAILER_EMAIL = process.env.MAILER_EMAIL;
const MAILER_NAME = process.env.MAILER_NAME;
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
        attachments: [
            {
                filename: "Logo.png",
                path: path_1.default.resolve(__dirname + "/Logo.png"),
                cid: "logo",
                contentDisposition: "inline",
            },
        ],
    });
    console.log("Message sent: %s", info.messageId);
};
//# sourceMappingURL=seeker.controller.js.map