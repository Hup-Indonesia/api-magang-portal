"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEducationById = exports.updateEducationById = exports.getEducationById = exports.getAllEducations = void 0;
const response_1 = __importDefault(require("./response"));
const Education_1 = __importDefault(require("../models/Education"));
const getAllEducations = async (req, res) => {
    try {
        const EDUCATIONS = await Education_1.default.findAll();
        return (0, response_1.default)(200, `success get all educations`, EDUCATIONS, res);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
};
exports.getAllEducations = getAllEducations;
const getEducationById = async (req, res) => {
    const educationId = req.params.id;
    try {
        const EDUCATION = await Education_1.default.findByPk(educationId);
        if (!EDUCATION)
            return res.status(404).json({ message: "education not found" });
        return (0, response_1.default)(200, `success get education by id`, EDUCATION, res);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getEducationById = getEducationById;
const updateEducationById = async (req, res) => {
    const id = req.params.id;
    const educationData = req.body;
    try {
        const EDUCATION = await Education_1.default.findByPk(id);
        if (!EDUCATION)
            return res.status(404).json({ message: "education not found" });
        await EDUCATION.update(educationData);
        return (0, response_1.default)(200, `success update education by id`, EDUCATION, res);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
exports.updateEducationById = updateEducationById;
const deleteEducationById = async (req, res) => {
    const id = req.params.id;
    try {
        const EDUCATION = await Education_1.default.findByPk(id);
        if (!EDUCATION)
            return res.status(404).json({ message: "education not found" });
        await EDUCATION.destroy();
        return (0, response_1.default)(200, `success delete education by id`, [], res);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
exports.deleteEducationById = deleteEducationById;
//# sourceMappingURL=educations.controller.js.map