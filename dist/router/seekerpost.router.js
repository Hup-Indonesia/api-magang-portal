"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seekerpost_controller_1 = require("../controllers/seekerpost.controller");
const postRouter = express_1.default.Router();
postRouter.get("/", seekerpost_controller_1.getAllSeekerPost);
postRouter.get("/:id", seekerpost_controller_1.getSeekerPostById);
postRouter.put("/interview/:id", seekerpost_controller_1.updateInterview);
postRouter.put("/offering/:id", seekerpost_controller_1.updateOffering);
postRouter.put("/:id", seekerpost_controller_1.updateSeekerPost);
exports.default = postRouter;
//# sourceMappingURL=seekerpost.router.js.map