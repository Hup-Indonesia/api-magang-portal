"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const experiences_controller_1 = require("../controllers/experiences.controller");
const express_1 = __importDefault(require("express"));
const experienceRouter = express_1.default.Router();
experienceRouter.get("/", experiences_controller_1.getAllExperiences);
experienceRouter.get("/:id", experiences_controller_1.getExperiencesById);
experienceRouter.put("/:id", experiences_controller_1.updateExperienceById);
experienceRouter.delete("/:id", experiences_controller_1.deleteExperienceById);
exports.default = experienceRouter;
//# sourceMappingURL=experiences.router.js.map