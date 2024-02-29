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
mahasiswaRouter.post("/register", seeker_controller_1.createSeeker);
mahasiswaRouter.post("/login", seeker_controller_1.loginSeeker);
mahasiswaRouter.post("/logout", seeker_controller_1.logoutSeeker);
mahasiswaRouter.post("/:id/experience", seeker_controller_1.addExperience);
mahasiswaRouter.post("/:id/education", seeker_controller_1.addEducation);
mahasiswaRouter.post("/:id/attachment", seeker_controller_1.setAttachment);
mahasiswaRouter.post("/:id/save-post", seeker_controller_1.addSavedPost);
mahasiswaRouter.post("/:id/recruiter", seeker_controller_1.addRecruiter);
mahasiswaRouter.post("/:id/posts/:postId", seeker_controller_1.addApplied);
mahasiswaRouter.put("/:id", seeker_controller_1.updateSeeker);
mahasiswaRouter.put("/:id/experience/:updateId", seeker_controller_1.updateExperience);
mahasiswaRouter.put("/:id/education/:updateId", seeker_controller_1.updateEducation);
mahasiswaRouter.delete("/:id", seeker_controller_1.deleteSeeker);
mahasiswaRouter.delete("/:id/experience/:deletionId", seeker_controller_1.deleteExperience);
mahasiswaRouter.delete("/:id/education/:deletionId", seeker_controller_1.deleteEducation);
mahasiswaRouter.delete("/:id/attachment/:fieldName", seeker_controller_1.deleteAttachment);
exports.default = mahasiswaRouter;
//# sourceMappingURL=seeker.router.js.map