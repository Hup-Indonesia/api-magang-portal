"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const educations_controller_1 = require("../controllers/educations.controller");
const express_1 = __importDefault(require("express"));
const educationsRouter = express_1.default.Router();
educationsRouter.get("/", educations_controller_1.getAllEducations);
educationsRouter.get("/:id", educations_controller_1.getEducationById);
educationsRouter.put("/:id", educations_controller_1.updateEducationById);
educationsRouter.delete("/:id", educations_controller_1.deleteEducationById);
exports.default = educationsRouter;
//# sourceMappingURL=educations.router.js.map