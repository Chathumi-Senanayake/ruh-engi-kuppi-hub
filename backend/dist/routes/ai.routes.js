"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
router.post('/study-guide', ai_controller_1.generateStudyGuide);
router.post('/chat', ai_controller_1.chat);
exports.default = router;
