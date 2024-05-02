"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seeker_controller_1 = require("../controllers/seeker.controller");
const express_1 = __importDefault(require("express"));
const mahasiswaRouter = express_1.default.Router();
mahasiswaRouter.get("/", seeker_controller_1.getAllSeeker);
mahasiswaRouter.get("/:id", seeker_controller_1.getSeekerById);
mahasiswaRouter.get("/:id/experiences", seeker_controller_1.getExperienceBySeekerId);
mahasiswaRouter.get("/:id/educations", seeker_controller_1.getEducationsBySeekerId);
mahasiswaRouter.get("/:id/attachment", seeker_controller_1.getAttachmentBySeekerId);
mahasiswaRouter.get("/:id/saved-posts", seeker_controller_1.getAllSavedPostBySeekerId);
mahasiswaRouter.get("/:id/applied-posts", seeker_controller_1.getAllAppliedPostBySeekerId);
mahasiswaRouter.post("/:id/experience", seeker_controller_1.addExperience);
mahasiswaRouter.post("/:id/education", seeker_controller_1.addEducation);
mahasiswaRouter.post("/:id/attachment", seeker_controller_1.setAttachment);
mahasiswaRouter.post("/:id/save-post", seeker_controller_1.addSavedPost);
mahasiswaRouter.post("/:id/posts/:postId", seeker_controller_1.addApplied);
mahasiswaRouter.post("/:id/recruiter", seeker_controller_1.addRecruiter);
mahasiswaRouter.put("/forget-password", seeker_controller_1.forgetPasswordWithEmail);
mahasiswaRouter.put("/:id", seeker_controller_1.updateSeeker);
mahasiswaRouter.delete("/:id", seeker_controller_1.deleteSeeker);
mahasiswaRouter.delete("/:id/attachment", seeker_controller_1.deleteAttachment);
exports.default = mahasiswaRouter;
//# sourceMappingURL=seeker.router.js.map