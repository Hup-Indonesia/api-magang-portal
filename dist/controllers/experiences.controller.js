"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExperienceById = exports.updateExperienceById = exports.getExperiencesById = exports.getAllExperiences = void 0;
const Experience_1 = __importDefault(require("../models/Experience"));
const response_1 = __importDefault(require("./response"));
const getAllExperiences = async (req, res) => {
    try {
        const EXPERIENCES = await Experience_1.default.findAll();
        return (0, response_1.default)(200, `success get all experiences`, EXPERIENCES, res);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
};
exports.getAllExperiences = getAllExperiences;
const getExperiencesById = async (req, res) => {
    const id = req.params.id;
    try {
        const EXPERIENCE = await Experience_1.default.findByPk(id);
        if (!EXPERIENCE)
            return res.status(404).json({ message: "experience not found" });
        return (0, response_1.default)(200, `success get experience by id`, EXPERIENCE, res);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getExperiencesById = getExperiencesById;
const updateExperienceById = async (req, res) => {
    const id = req.params.id;
    const experienceData = req.body;
    try {
        const EXPERIENCE = await Experience_1.default.findByPk(id);
        if (!EXPERIENCE)
            return res.status(404).json({ message: "experience not found" });
        await EXPERIENCE.update(experienceData);
        return (0, response_1.default)(200, `success update experience by id`, EXPERIENCE, res);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
exports.updateExperienceById = updateExperienceById;
const deleteExperienceById = async (req, res) => {
    const id = req.params.id;
    try {
        const EXPERIENCE = await Experience_1.default.findByPk(id);
        if (!EXPERIENCE)
            return res.status(404).json({ message: "experience not found" });
        await EXPERIENCE.destroy();
        return (0, response_1.default)(200, `success delete experience by id`, [], res);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
exports.deleteExperienceById = deleteExperienceById;
//# sourceMappingURL=experiences.controller.js.map