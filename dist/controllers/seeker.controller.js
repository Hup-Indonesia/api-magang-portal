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
exports.addApplied = exports.addSavedPost = exports.addRecruiter = exports.deleteAttachment = exports.setAttachment = exports.updateEducation = exports.deleteEducation = exports.addEducation = exports.updateExperience = exports.deleteExperience = exports.addExperience = exports.deleteSeeker = exports.updateSeeker = exports.logoutSeeker = exports.loginSeeker = exports.createSeeker = exports.getSeekerById = exports.getAllSeeker = void 0;
const Seeker_1 = __importDefault(require("../models/Seeker"));
const Experience_1 = __importDefault(require("../models/Experience"));
const Education_1 = __importDefault(require("../models/Education"));
const response_1 = __importDefault(require("./response"));
const bcrypt = __importStar(require("bcrypt"));
const JWT_1 = require("../config/JWT");
const Attachment_1 = __importDefault(require("../models/Attachment"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Recruiter_1 = __importDefault(require("../models/Recruiter"));
const Post_1 = __importDefault(require("../models/Post"));
const Mailer_1 = __importDefault(require("../config/Mailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Fungsi ini mengambil semua pengguna
const getAllSeeker = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 9999;
        let startIndex = (+page - 1) * +limit;
        let endIndex = +page * +limit;
        const seeker = await Seeker_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt", "password"] }, include: [
                { model: Experience_1.default, as: "experiences", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Education_1.default, as: "educations", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Attachment_1.default, as: "attachment", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Post_1.default, as: "applied", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Post_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt"] } },
            ] });
        const result = seeker.slice(startIndex, endIndex);
        (0, response_1.default)(200, "success call all seeker", result, res);
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getAllSeeker = getAllSeeker;
// Fungsi ini mengambil satu pengguna berdasarkan ID
const getSeekerById = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const mahasiswa = await Seeker_1.default.findByPk(seekerId, { attributes: { exclude: ["createdAt", "updatedAt", "password"] }, include: [
                { model: Experience_1.default, as: "experiences", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Education_1.default, as: "educations", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Attachment_1.default, as: "attachment", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Post_1.default, as: "applied", attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                        { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] } },
                    ] },
                { model: Post_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                        { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] } },
                        { model: Seeker_1.default, as: "applicants", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                        { model: Seeker_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                    ] },
            ] });
        if (mahasiswa) {
            (0, response_1.default)(200, `Success get customer by id`, mahasiswa, res);
        }
        else {
            (0, response_1.default)(404, "Seeker not found", [], res);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSeekerById = getSeekerById;
// Fungsi ini membuat pengguna baru
const createSeeker = async (req, res) => {
    const seekerData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    seekerData.role = "seeker";
    try {
        hashPassword(seekerData.password)
            .then(async (hashedPassword) => {
            seekerData.password = hashedPassword;
            let newSeeker = await Seeker_1.default.create(seekerData);
            // Membut cookies untuk login
            const accessToken = (0, JWT_1.createToken)(newSeeker);
            res.cookie("access-token", accessToken, {
                maxAge: 3600000,
            });
            // HERE
            sendWelcomeEmail(seekerData.email, seekerData.first_name);
            (0, response_1.default)(201, "success create new users", newSeeker, res);
        })
            .catch((error) => {
            console.error("Gagal membuat pengguna:", error);
            res.status(500).json({ error: "Server error" });
        });
    }
    catch (error) {
        console.error("Gagal membuat pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.createSeeker = createSeeker;
const loginSeeker = async (req, res) => {
    const seekerData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    try {
        let seeker = await Seeker_1.default.findOne({
            where: {
                email: seekerData.email
            }
        });
        if (!seeker)
            return (0, response_1.default)(400, "seeker not found", [], res);
        bcrypt.compare(seekerData.password, seeker.password).then((match) => {
            if (!match) {
                return res.json({ error: "wrong username and password combination" });
            }
            else {
                const accessToken = (0, JWT_1.createToken)(seeker);
                res.cookie("access-token", accessToken, {
                    maxAge: 360000000,
                });
                return (0, response_1.default)(200, "success login", seeker, res);
            }
        });
    }
    catch (error) {
        console.error("Gagal login pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.loginSeeker = loginSeeker;
const logoutSeeker = async (req, res) => {
    try {
        res.clearCookie("access-token");
        res.redirect("/");
    }
    catch (error) {
        console.error("Gagal logout pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.logoutSeeker = logoutSeeker;
// Fungsi ini memperbarui pengguna berdasarkan ID
const updateSeeker = async (req, res) => {
    const seekerId = req.params.id;
    const updatedSeeker = req.body; // Data pembaruan pengguna dari permintaan PUT  
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Menambahakan URL Image ke dalam gambar, 
            // dan menghapus gambar lama ketika upload gambar baru
            if (req.files.length !== 0) {
                if (seeker.profile_picture) {
                    const fileToDelete = `public/files/uploads/${seeker.profile_picture.split("uploads/")[1]}`;
                    if (fs_1.default.existsSync(fileToDelete)) {
                        try {
                            fs_1.default.unlinkSync(fileToDelete);
                            console.log(`File ${seeker.profile_picture.split("uploads/")[1]} deleted successfully.`);
                        }
                        catch (err) {
                            console.error(`Error deleting file ${seeker.profile_picture.split("uploads/")[1]}: ${err}`);
                        }
                    }
                    else {
                        console.log(`File ${seeker.profile_picture.split("uploads/")[1]} not found.`);
                    }
                }
                req.body.profile_picture = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
            }
            await seeker.update(updatedSeeker);
            (0, response_1.default)(200, "Success update pengguna", seeker, res);
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
exports.updateSeeker = updateSeeker;
// Fungsi ini menghapus pengguna berdasarkan ID
const deleteSeeker = async (req, res) => {
    const seekerId = req.params.id;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            await seeker.destroy();
            res.status(204).end(); // Mengembalikan 204 No Content jika pengguna berhasil dihapus
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal menghapus pengguna:", error);
        res.status(500).json({ error: "Server error" });
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
        throw new Error('Error hashing password');
    }
};
// EXPERIENCES
// Fungsi ini membuat experience pengguna berdasarkan ID
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
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.addExperience = addExperience;
const deleteExperience = async (req, res) => {
    const seekerId = req.params.id;
    const deletionId = req.params.deletionId;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const experience = await seeker.getExperiences({ where: { id: deletionId } });
            if (experience.length > 0) {
                // Jika pengalaman ditemukan, hapus pengalaman tersebut
                seeker.removeExperience(experience);
                await Experience_1.default.destroy({ where: { id: deletionId } });
                (0, response_1.default)(200, "Pengalaman berhasil dihapus", seeker, res);
            }
            else {
                res.status(404).json({ error: "Experience tidak ditemukan" });
            }
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
exports.deleteExperience = deleteExperience;
const updateExperience = async (req, res) => {
    const seekerId = req.params.id;
    const updateId = req.params.updateId;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const experience = await seeker.getExperiences({ where: { id: updateId } });
            if (experience.length > 0) {
                if (req.body.exp_enddate == null)
                    req.body.exp_enddate = null;
                await Experience_1.default.update(req.body, { where: { id: updateId } });
                (0, response_1.default)(200, "Education berhasil diupdate", seeker, res);
            }
            else {
                res.status(404).json({ error: "Education tidak ditemukan" });
            }
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
exports.updateExperience = updateExperience;
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
const deleteEducation = async (req, res) => {
    const seekerId = req.params.id;
    const deletionId = req.params.deletionId;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const education = await seeker.getEducations({ where: { id: deletionId } });
            if (education.length > 0) {
                // Jika pengalaman ditemukan, hapus pengalaman tersebut
                seeker.removeEducation(education);
                await Education_1.default.destroy({ where: { id: deletionId } });
                (0, response_1.default)(200, "Education berhasil dihapus", seeker, res);
            }
            else {
                res.status(404).json({ error: "Education tidak ditemukan" });
            }
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
exports.deleteEducation = deleteEducation;
const updateEducation = async (req, res) => {
    const seekerId = req.params.id;
    const updateId = req.params.updateId;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const education = await seeker.getEducations({ where: { id: updateId } });
            if (education.length > 0) {
                await Education_1.default.update(req.body, { where: { id: updateId } });
                (0, response_1.default)(200, "Education berhasil diupdate", seeker, res);
            }
            else {
                res.status(404).json({ error: "Education tidak ditemukan" });
            }
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
exports.updateEducation = updateEducation;
// ATTACHMENT
const setAttachment = async (req, res) => {
    const seekerId = req.params.id;
    const attachmentData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // if user upload file resume
            let attachment = (await seeker.getAttachment());
            attachmentData.atc_resume = attachment ? attachment.atc_resume : null;
            if (req.files.length !== 0) {
                if (attachment) {
                    if (attachment.atc_resume) {
                        const filename = attachment.atc_resume.split("/uploads")[1];
                        const fileToDelete = `public/files/uploads/${filename}`;
                        if (fs_1.default.existsSync(fileToDelete)) {
                            try {
                                fs_1.default.unlinkSync(fileToDelete);
                                console.log(`File ${filename} deleted successfully.`);
                            }
                            catch (err) {
                                console.error(`Error deleting file ${filename}: ${err}`);
                            }
                        }
                        else {
                            console.log(`File ${filename} not found.`);
                        }
                    }
                }
                attachmentData.atc_resume = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
            }
            // check if attachment not null delete previous data
            let attachmentId = attachment ? attachment.id : null;
            if (attachmentId) {
                await Attachment_1.default.update(attachmentData, { where: { id: attachmentId } });
                (0, response_1.default)(200, "Success update attachment", seeker, res);
            }
            else {
                // create new attachment
                await Attachment_1.default.create(attachmentData).then(async function (result) {
                    await seeker.setAttachment(result);
                    (0, response_1.default)(200, "Success update pengguna", seeker, res);
                });
            }
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
exports.setAttachment = setAttachment;
const deleteAttachment = async (req, res) => {
    const seekerId = req.params.id;
    const fieldName = req.params.fieldName;
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            const attachmentData = (await seeker.getAttachment());
            if (attachmentData) {
                if (attachmentData[fieldName]) {
                    attachmentData[fieldName] = null;
                    await attachmentData.save();
                    (0, response_1.default)(200, `${fieldName} berhasil dihapus`, seeker, res);
                }
                else {
                    res.status(404).json({ error: `${fieldName} tidak ditemukan` });
                }
            }
            else {
                res.status(404).json({ error: "Attachment tidak ditemukan" });
            }
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
exports.deleteAttachment = deleteAttachment;
// Recruiter Register
const addRecruiter = async (req, res) => {
    const seekerId = req.params.id;
    const recruiterData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        if (seeker) {
            await Recruiter_1.default.create(recruiterData).then(async function (result) {
                await seeker.setRecruiter(result);
                seeker.update({ role: "recruiter" });
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
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.addSavedPost = addSavedPost;
// Seeker Apply Post
const addApplied = async (req, res) => {
    const seekerId = req.params.id;
    const postId = req.params.postId;
    const seekerData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const seeker = await Seeker_1.default.findByPk(seekerId);
        const post = await Post_1.default.findByPk(postId);
        let attachment = (await seeker.getAttachment());
        seekerData.atc_resume = attachment ? attachment.atc_resume : null;
        if (req.files.length !== 0) {
            if (attachment) {
                if (attachment.atc_resume) {
                    const filename = attachment.atc_resume.split("/uploads")[1];
                    const fileToDelete = `public/files/uploads/${filename}`;
                    if (fs_1.default.existsSync(fileToDelete)) {
                        try {
                            fs_1.default.unlinkSync(fileToDelete);
                            console.log(`File ${filename} deleted successfully.`);
                        }
                        catch (err) {
                            console.error(`Error deleting file ${filename}: ${err}`);
                        }
                    }
                    else {
                        console.log(`File ${filename} not found.`);
                    }
                }
            }
            seekerData.atc_resume = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
        }
        let attachmentId = attachment ? attachment.id : null;
        if (seeker) {
            if (attachmentId) {
                await Attachment_1.default.update(seekerData, { where: { id: attachmentId } });
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
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.addApplied = addApplied;
function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    // Padding digit bulan dan tanggal dengan '0' jika diperlukan
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    // Menggabungkan tahun, bulan, dan tanggal dengan format yang diinginkan
    const formattedToday = `${year}-${month}-${day}`;
    return formattedToday;
}
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
        attachments: [{
                filename: "Logo.png",
                path: path_1.default.resolve(__dirname + "/Logo.png"),
                cid: 'logo',
                contentDisposition: "inline"
            }]
    });
    console.log("Message sent: %s", info.messageId);
};
//# sourceMappingURL=seeker.controller.js.map