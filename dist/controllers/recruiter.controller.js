"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRecruiter = exports.CreateRecruiter = exports.editPost = exports.addPost = exports.deleteGallery = exports.addGallery = exports.verificationRecruiter = exports.updateRecruiter = exports.getRecruiterById = exports.getAllRecruiter = void 0;
const Seeker_1 = __importDefault(require("../models/Seeker"));
const response_1 = __importDefault(require("./response"));
const fs_1 = __importDefault(require("fs"));
const Recruiter_1 = __importDefault(require("../models/Recruiter"));
const Gallery_1 = __importDefault(require("../models/Gallery"));
const Post_1 = __importDefault(require("../models/Post"));
const getAllRecruiter = async (req, res) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 9999;
        let startIndex = (+page - 1) * +limit;
        let endIndex = +page * +limit;
        const recruiters = await Recruiter_1.default.findAll({ attributes: { exclude: [, "updatedAt"] }, include: [
                { model: Gallery_1.default, as: "gallery", attributes: { exclude: ["createdAt", "updatedAt"] } },
                { model: Post_1.default, as: "posts", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] }, include: [
                        { model: Seeker_1.default, as: "applicants", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } }
                    ] }
            ] });
        const result = recruiters.slice(startIndex, endIndex);
        (0, response_1.default)(200, "success call all recruiter", result, res);
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: error });
    }
};
exports.getAllRecruiter = getAllRecruiter;
const getRecruiterById = async (req, res) => {
    const recruiterId = req.params.id;
    try {
        const recruiter = await Recruiter_1.default.findByPk(recruiterId, { attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                { model: Gallery_1.default, as: "gallery", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                { model: Post_1.default, as: "posts", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, include: [
                        { model: Seeker_1.default, as: "applicants", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } }
                    ], through: { attributes: [] } },
            ] });
        if (recruiter) {
            return (0, response_1.default)(200, "success get recruiter by id", recruiter, res);
        }
        else {
            return (0, response_1.default)(404, "recruiter not found", [], res);
        }
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.getRecruiterById = getRecruiterById;
const updateRecruiter = async (req, res) => {
    const recruiterId = req.params.id;
    const updatedRecruiter = req.body; // Data pembaruan pengguna dari permintaan PUT  
    try {
        const recruiter = await Recruiter_1.default.findByPk(recruiterId);
        if (recruiter) {
            // Menambahakan URL Image ke dalam gambar, 
            // dan menghapus gambar lama ketika upload gambar baru
            if (req.files.length !== 0) {
                if (req.files[0].fieldname == "org-banner") {
                    if (recruiter.rec_banner) {
                        const fileToDelete = `public/files/uploads/${recruiter.rec_banner.split("uploads/")[1]}`;
                        if (fs_1.default.existsSync(fileToDelete)) {
                            try {
                                fs_1.default.unlinkSync(fileToDelete);
                                console.log(`File ${recruiter.rec_banner.split("uploads/")[1]} deleted successfully.`);
                            }
                            catch (err) {
                                console.error(`Error deleting file ${recruiter.rec_banner.split("uploads/")[1]}: ${err}`);
                            }
                        }
                        else {
                            console.log(`File ${recruiter.rec_banner.split("uploads/")[1]} not found.`);
                        }
                    }
                    req.body.rec_banner = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
                }
                else if (req.files[0].fieldname == "rec-org-logo") {
                    if (recruiter.rec_org_logo) {
                        const fileToDelete = `public/files/uploads/${recruiter.rec_org_logo.split("uploads/")[1]}`;
                        if (fs_1.default.existsSync(fileToDelete)) {
                            try {
                                fs_1.default.unlinkSync(fileToDelete);
                                console.log(`File ${recruiter.rec_org_logo.split("uploads/")[1]} deleted successfully.`);
                            }
                            catch (err) {
                                console.error(`Error deleting file ${recruiter.rec_org_logo.split("uploads/")[1]}: ${err}`);
                            }
                        }
                        else {
                            console.log(`File ${recruiter.rec_org_logo.split("uploads/")[1]} not found.`);
                        }
                    }
                    req.body.rec_org_logo = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
                }
            }
            await recruiter.update(updatedRecruiter);
            (0, response_1.default)(200, "Success update pengguna", recruiter, res);
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: error });
    }
};
exports.updateRecruiter = updateRecruiter;
const verificationRecruiter = async (req, res) => {
    const recruiterId = req.params.id;
    const updatedRecruiter = req.body; // Data pembaruan pengguna dari permintaan PUT  
    updatedRecruiter.rec_verified = true;
    try {
        const recruiter = await Recruiter_1.default.findByPk(recruiterId);
        if (recruiter) {
            await recruiter.update(updatedRecruiter);
            (0, response_1.default)(200, "Success update pengguna", recruiter, res);
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: error });
    }
};
exports.verificationRecruiter = verificationRecruiter;
// GALLERY
const addGallery = async (req, res) => {
    const recruiterId = req.params.id;
    const galleryData = req.body; // Data pembaruan pengguna dari permintaan PUT
    try {
        const recruiter = await Recruiter_1.default.findByPk(recruiterId);
        if (recruiter) {
            console.log(req.files);
            if (req.files.length !== 0) {
                let gal_photo = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[req.files.length - 1].filename}`;
                await Gallery_1.default.create({ gal_photo: gal_photo }).then(async function (result) {
                    await recruiter.addGallery(result);
                    (0, response_1.default)(200, "success add gallery", result, res);
                });
            }
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: error });
    }
};
exports.addGallery = addGallery;
const deleteGallery = async (req, res) => {
    const galleryId = req.params.galleryId;
    try {
        const GALLERY = await Gallery_1.default.findByPk(galleryId);
        if (GALLERY) {
            // Temukan pengalaman dengan ID tertentu yang dimiliki oleh seeker
            GALLERY.destroy();
            (0, response_1.default)(200, "delete gallery success", GALLERY, res);
        }
        else {
            res.status(404).json({ error: "Gallery tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal menghapus gallery:", error);
        res.status(500).json({ error: error });
    }
};
exports.deleteGallery = deleteGallery;
// POST
const addPost = async (req, res) => {
    let postData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    const recruiterId = req.params.id;
    try {
        const recruiter = await Recruiter_1.default.findByPk(recruiterId);
        if (postData.post_resume_req !== undefined)
            postData.post_resume_req = true;
        if (postData.post_portfolio_req !== undefined)
            postData.post_portfolio_req = true;
        if (postData.post_thp_type !== "Undisclosed") {
            if (postData.post_thp_min && !postData.post_thp_max)
                postData.post_thp = `Rp.${postData.post_thp_min}+`;
            if (!postData.post_thp_min && postData.post_thp_max)
                postData.post_thp = `Rp.0-Rp.${postData.post_thp_max}`;
            if (postData.post_thp_min && postData.post_thp_max)
                postData.post_thp = `Rp.${postData.post_thp_min}-Rp.${postData.post_thp_max}`;
        }
        else {
            postData.post_thp = "Undisclosed";
        }
        if (recruiter) {
            await Post_1.default.create(postData).then(async function (result) {
                await recruiter.addPost(result);
                (0, response_1.default)(200, "Success update pengguna", recruiter, res);
            });
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal membuat pengguna:", error);
        res.status(500).json({ error: error });
    }
};
exports.addPost = addPost;
const editPost = async (req, res) => {
    let postData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    const recruiterId = req.params.id;
    const postId = req.params.postId;
    try {
        const recruiter = await Recruiter_1.default.findByPk(recruiterId);
        if (postData.post_resume_req)
            postData.post_resume_req = true;
        if (postData.post_portfolio_req)
            postData.post_portfolio_req = true;
        if (postData.post_thp_type !== "Undisclosed") {
            if (postData.post_thp_min && !postData.post_thp_max)
                postData.post_thp = `Rp.${postData.post_thp_min}+`;
            if (!postData.post_thp_min && postData.post_thp_max)
                postData.post_thp = `Rp.0-Rp.${postData.post_thp_max}`;
            if (postData.post_thp_min && postData.post_thp_max)
                postData.post_thp = `Rp.${postData.post_thp_min}-Rp.${postData.post_thp_max}`;
        }
        else {
            postData.post_thp = "Undisclosed";
        }
        if (recruiter) {
            let POST = await Post_1.default.findByPk(postId);
            if (POST) {
                POST.update(postData);
                (0, response_1.default)(200, "Success update pengguna", recruiter, res);
            }
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal membuat pengguna:", error);
        res.status(500).json({ error: error });
    }
};
exports.editPost = editPost;
const CreateRecruiter = async (req, res) => {
    let recruiterData = req.body;
    try {
        if (req.files.length !== 0) {
            recruiterData.rec_org_logo = `${req.protocol + "://" + req.get("host")}/files/uploads/${req.files[0].filename}`;
        }
        recruiterData.rec_mode = "External";
        const recruiter = await Recruiter_1.default.create(recruiterData);
        (0, response_1.default)(201, "Success create recruiter", recruiter, res);
    }
    catch (error) {
        console.error("Gagal membuat pengguna:", error);
        res.status(500).json({ error: error });
    }
};
exports.CreateRecruiter = CreateRecruiter;
const DeleteRecruiter = async (req, res) => {
    let recruiterId = req.params.id;
    let RECRUITER = await Recruiter_1.default.findByPk(recruiterId);
    try {
        if (RECRUITER) {
            const allPosts = await RECRUITER.getPosts();
            allPosts.forEach(post => post.destroy());
            RECRUITER.destroy();
            return (0, response_1.default)(200, "Success menghapus recruiter", [], res);
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal menghapus recruiter:", error);
        res.status(500).json({ error: error });
    }
};
exports.DeleteRecruiter = DeleteRecruiter;
//# sourceMappingURL=recruiter.controller.js.map