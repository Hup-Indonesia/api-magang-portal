"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePost = exports.CreatePostExternal = exports.updatePosts = exports.getPostById = exports.getAllPost = void 0;
const Seeker_1 = __importDefault(require("../models/Seeker"));
const Experience_1 = __importDefault(require("../models/Experience"));
const Education_1 = __importDefault(require("../models/Education"));
const response_1 = __importDefault(require("./response"));
const Recruiter_1 = __importDefault(require("../models/Recruiter"));
const Post_1 = __importDefault(require("../models/Post"));
const node_cron_1 = __importDefault(require("node-cron"));
const getAllPost = async (req, res) => {
    try {
        let postQuery = req.query;
        let page = req.query.page || 1;
        let limit = req.query.limit || 9999;
        let startIndex = (+page - 1) * +limit;
        let endIndex = +page * +limit;
        const post = await Post_1.default.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] } },
                { model: Seeker_1.default, as: "applicants", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
                { model: Seeker_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
            ] });
        const result = post.slice(startIndex, endIndex);
        return (0, response_1.default)(200, "success call all posts", result, res);
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getAllPost = getAllPost;
const getPostById = async (req, res) => {
    try {
        const post = await Post_1.default.findOne({ where: { id: req.params.id }, attributes: { exclude: ["createdAt", "updatedAt"] }, include: [
                { model: Recruiter_1.default, as: "recruiter", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, through: { attributes: [] } },
                { model: Seeker_1.default, as: "applicants", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] }, include: [
                        { model: Experience_1.default, as: "experiences", attributes: { exclude: ["createdAt", "updatedAt"] } },
                        { model: Education_1.default, as: "educations", attributes: { exclude: ["createdAt", "updatedAt"] } },
                    ] },
                { model: Seeker_1.default, as: "saved", attributes: { exclude: ["createdAt", "updatedAt", "ownerId"] } },
            ] });
        if (post) {
            return (0, response_1.default)(200, "success get all posts", post, res);
        }
        else {
            return (0, response_1.default)(404, "post not found", [], res);
        }
    }
    catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getPostById = getPostById;
const updatePosts = async (req, res) => {
    const postId = req.params.id;
    const updatedPost = req.body; // Data pembaruan pengguna dari permintaan PUT  
    try {
        const post = await Post_1.default.findByPk(postId);
        if (post) {
            await post.update(updatedPost);
            (0, response_1.default)(200, "Success update pengguna", post, res);
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
exports.updatePosts = updatePosts;
const CreatePostExternal = async (req, res) => {
    let postData = req.body; // Anda akan mendapatkan data pengguna dari permintaan POST
    const recruiterId = postData.recruiter_id;
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
        postData.post_mode = "External";
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
exports.CreatePostExternal = CreatePostExternal;
const DeletePost = async (req, res) => {
    const postId = req.params.id;
    const POST = await Post_1.default.findByPk(postId);
    try {
        if (POST) {
            POST.destroy();
            return (0, response_1.default)(200, "Success menghapus post", [], res);
        }
        else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    }
    catch (error) {
        console.error("Gagal menghapus post:", error);
        res.status(500).json({ error: error });
    }
};
exports.DeletePost = DeletePost;
node_cron_1.default.schedule('0 */2 * * *', () => {
    CronAutoCloseJob();
});
async function CronAutoCloseJob() {
    const POSTS = await Post_1.default.findAll();
    POSTS.forEach(async (post) => {
        let isOnDate = compareDates(post.post_deadline);
        if (isOnDate == false) {
            post.update({ post_status: "CLOSED" });
        }
    });
}
function compareDates(inputDate) {
    const today = new Date();
    const inputDateObject = new Date(inputDate);
    // Atur jam, menit, detik, dan milidetik ke nol untuk membandingkan hanya tanggal
    today.setHours(0, 0, 0, 0);
    inputDateObject.setHours(0, 0, 0, 0);
    // Bandingkan tanggal
    if (today.getTime() === inputDateObject.getTime()) {
        // Jika today sama dengan inputDate
        return false;
    }
    else if (today.getTime() > inputDateObject.getTime()) {
        // Jika today sudah melebihi inputDate
        return false;
    }
    else {
        // Jika today masih sebelum inputDate
        return true;
    }
}
//# sourceMappingURL=post.controller.js.map