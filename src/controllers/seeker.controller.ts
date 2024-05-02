import { Request, Response } from "express";
import Seeker from "../models/Seeker";
import Experience from "../models/Experience";
import Education from "../models/Education";
import response from "./response";
import * as bcrypt from "bcrypt";
import { createToken } from "../config/JWT";
import Attachment from "../models/Attachment";
import path from "path";
import Recruiter from "../models/Recruiter";
import Post from "../models/Post";
import transporter from "../config/Mailer";
import * as dotenv from "dotenv";
dotenv.config();

// Fungsi ini mengambil semua pengguna
export const getAllSeeker = async (req: Request, res: Response) => {
    try {
        let db_page = req.query.page || 1;
        let db_limit = req.query.limit || 20;

        const seeker = await Seeker.findAll({
            limit: +db_limit,
            offset: (+db_page - 1) * +db_limit,
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        });

        return res.status(200).json({
            status_code: 200,
            message: "success call all seeker",
            limit: db_limit,
            page: db_page,
            datas: seeker,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi ini mengambil satu pengguna berdasarkan ID
export const getSeekerById = async (req: Request, res: Response) => {
    const seekerId = req.params.id;

    try {
        const mahasiswa = await Seeker.findByPk(seekerId, {
            attributes: { exclude: ["createdAt", "updatedAt", "password"] },
            include: [
                {
                    model: Experience,
                    as: "experiences",
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                },
                {
                    model: Education,
                    as: "educations",
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                },
                {
                    model: Attachment,
                    as: "attachment",
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                },
                {
                    model: Recruiter,
                    as: "recruiter",
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                },
                {
                    model: Post,
                    as: "applied",
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    include: [
                        {
                            model: Recruiter,
                            as: "recruiter",
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "ownerId"],
                            },
                            through: { attributes: [] },
                        },
                    ],
                },
                {
                    model: Post,
                    as: "saved",
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    include: [
                        {
                            model: Recruiter,
                            as: "recruiter",
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "ownerId"],
                            },
                            through: { attributes: [] },
                        },
                        {
                            model: Seeker,
                            as: "applicants",
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "ownerId"],
                            },
                        },
                        {
                            model: Seeker,
                            as: "saved",
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "ownerId"],
                            },
                        },
                    ],
                },
            ],
        });

        if (!mahasiswa)
            return res.status(404).json({ message: "seeker not found" });

        return response(200, `success get customer by id`, mahasiswa, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi ini memperbarui pengguna berdasarkan ID
export const updateSeeker = async (req: Request, res: Response) => {
    const seekerId = req.params.id;
    const updatedSeeker = req.body; // Data pembaruan pengguna dari permintaan PUT

    try {
        const seeker = await Seeker.findByPk(seekerId);

        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });

        if (seeker) {
            await seeker.update(updatedSeeker);
            response(200, "success update pengguna", seeker, res);
        }
    } catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: error.message });
    }
};

export const forgetPasswordWithEmail = async (req: Request, res: Response) => {
    const updatedSeeker = req.body; // Data pembaruan pengguna dari permintaan PUT

    try {
        if (!updatedSeeker.email)
            return res.status(400).json({ message: "email required" });
        if (!updatedSeeker.password)
            return res.status(400).json({ message: "password required" });

        const seeker = await Seeker.findOne({
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
    } catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Fungsi ini menghapus pengguna berdasarkan ID
export const deleteSeeker = async (req: Request, res: Response) => {
    const seekerId = req.params.id;

    try {
        const seeker = await Seeker.findByPk(seekerId);

        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });

        if (seeker) {
            await seeker.destroy();
            return res.status(204).end(); // Mengembalikan 204 No Content jika pengguna berhasil dihapus
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const hashPassword = async (plainPassword: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password");
    }
};

// EXPERIENCES

// Fungsi ini membuat experience pengguna berdasarkan ID
export const getExperienceBySeekerId = async (req: Request, res: Response) => {
    const seekerId = req.params.id;

    try {
        const seeker = await Seeker.findByPk(seekerId);

        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });

        const EXPERIENCES = await seeker.getExperiences();

        return response(
            200,
            "success get all experience from some seeker",
            EXPERIENCES,
            res
        );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const addExperience = async (req: Request, res: Response) => {
    const seekerId = req.params.id;
    const experienceData = req.body; // Data pembaruan pengguna dari permintaan PUT

    try {
        const seeker = await Seeker.findByPk(seekerId);
        if (seeker) {
            await Experience.create(experienceData).then(async function (
                result
            ) {
                await seeker.addExperience(result);
                response(200, "Success update pengguna", seeker, res);
            });
        } else {
            res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// EDUCATION

// Fungsi ini membuat education pengguna berdasarkan ID
export const addEducation = async (req: Request, res: Response) => {
    const seekerId = req.params.id;
    const educationData = req.body; // Data pembaruan pengguna dari permintaan PUT

    try {
        const seeker = await Seeker.findByPk(seekerId);
        if (seeker) {
            await Education.create(educationData).then(async function (result) {
                await seeker.addEducation(result);
                response(200, "Success update pengguna", seeker, res);
            });
        } else {
            res.status(404).json({ error: "Pengguna tidak ditemukan" });
        }
    } catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getEducationsBySeekerId = async (req: Request, res: Response) => {
    const seekerId = req.params.id;

    try {
        const seeker = await Seeker.findByPk(seekerId);

        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });

        const EDUCATIONS = await seeker.getEducations();

        return response(
            200,
            "success get all educations from some seeker",
            EDUCATIONS,
            res
        );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ATTACHMENT
export const getAttachmentBySeekerId = async (req: Request, res: Response) => {
    const seekerId = req.params.id;

    try {
        const seeker = await Seeker.findByPk(seekerId);

        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });

        const ATTACHMENT = await seeker.getAttachment({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        return response(200, "success get attachment", ATTACHMENT, res);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const setAttachment = async (req: Request, res: Response) => {
    const seekerId = req.params.id;
    const attachmentData = req.body; // Data pembaruan pengguna dari permintaan PUT

    try {
        const seeker = await Seeker.findByPk(seekerId);

        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });

        if (seeker) {
            // if user upload file resume
            let attachment = await seeker.getAttachment();

            attachmentData.atc_resume = attachment
                ? attachment.atc_resume
                : null;

            if (req.files.length !== 0) {
                attachmentData.atc_resume = `${
                    req.protocol + "://" + req.get("host")
                }/files/uploads/${req.files[0].filename}`;
            }

            // check if attachment not null delete previous data
            let attachmentId = attachment ? attachment?.id : null;

            if (attachment) {
                await Attachment.update(attachmentData, {
                    where: { id: attachmentId },
                });
                return response(200, "Success update attachment", seeker, res);
            } else {
                // create new attachment
                await Attachment.create(attachmentData).then(async function (
                    result
                ) {
                    await seeker.setAttachment(result);
                    return response(
                        200,
                        "Success membuat attachment baru",
                        seeker,
                        res
                    );
                });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAttachment = async (req: Request, res: Response) => {
    const seekerId = req.params.id;
    const attachmentBody = req.body;

    try {
        const seeker = await Seeker.findByPk(seekerId);

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
                return response(
                    200,
                    "success delete attachment field",
                    [],
                    res
                );
            }
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Recruiter Register
export const addRecruiter = async (req: Request, res: Response) => {
    const seekerId = req.params.id;
    const recruiterData = req.body; // Data pembaruan pengguna dari permintaan PUT

    try {
        const seeker = await Seeker.findByPk(seekerId);

        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });

        if (seeker) {
            await Recruiter.create(recruiterData).then(async function (result) {
                await seeker.setRecruiter(result);
                seeker.update({ role: "recruiter" });
                response(200, "Success update pengguna", seeker, res);
            });
        }
    } catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const addSavedPost = async (req: Request, res: Response) => {
    const seekerId = req.params.id;
    const recruiterData = req.body; // Data pembaruan pengguna dari permintaan PUT

    try {
        const seeker = await Seeker.findByPk(seekerId);
        const post = await Post.findByPk(recruiterData.post_id);

        if (seeker) {
            if (recruiterData.loved == "true") {
                seeker.addSaved(post);
                return response(200, "Success update pengguna", [], res);
            } else {
                seeker.removeSaved(post);
                return response(200, "Success hapus post", [], res);
            }
        } else {
            res.status(404).json({ message: "seeker not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllSavedPostBySeekerId = async (
    req: Request,
    res: Response
) => {
    const seekerId = req.params.id;

    try {
        const seeker = await Seeker.findByPk(seekerId);

        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });

        const SAVED_POST = await seeker.getSaved({
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                {
                    model: Recruiter,
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
        return response(200, "success get all saved post", SAVED_POST, res);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Seeker Apply Post
export const addApplied = async (req: Request, res: Response) => {
    const seekerId = req.params.id;
    const postId = req.params.postId;
    const seekerData = req.body; // Data pembaruan pengguna dari permintaan PUT

    try {
        const seeker = await Seeker.findByPk(seekerId);
        const post = await Post.findByPk(postId);

        if (!seeker)
            return res.status(404).json({ message: "seeker not found" });

        let attachment = await seeker.getAttachment();
        seekerData.atc_resume = attachment ? attachment.atc_resume : null;

        if (req.files.length !== 0) {
            seekerData.atc_resume = `${
                req.protocol + "://" + req.get("host")
            }/files/uploads/${req.files[0].filename}`;
        }

        let attachmentId = attachment ? attachment.id : null;

        if (seeker) {
            if (attachmentId) {
                await Attachment.update(seekerData, {
                    where: { id: attachmentId },
                });
            } else {
                // create new attachment
                await Attachment.create(seekerData).then(async function (
                    result
                ) {
                    await seeker.setAttachment(result);
                });
            }

            await seeker.addApplied(post);
            let applied = await seeker.getApplied({ where: { id: postId } });

            return res.send(applied[0]);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllAppliedPostBySeekerId = async (
    req: Request,
    res: Response
) => {
    const seekerId = req.params.id;

    try {
        const seeker = await Seeker.findByPk(seekerId);

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
                    model: Recruiter,
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
        return response(200, "success get all applied post", APPLIED_POST, res);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

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
    const info = await transporter.sendMail({
        from: `"${MAILER_NAME}" <${MAILER_EMAIL}>`, // sender address
        to: userEmail,
        subject: `Haloo ${userName}! Selamat bergabung`,
        html: emailHTML,
        attachments: [
            {
                filename: "Logo.png",
                path: path.resolve(__dirname + "/Logo.png"),
                cid: "logo",
                contentDisposition: "inline",
            },
        ],
    });

    console.log("Message sent: %s", info.messageId);
};
