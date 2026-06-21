"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = exports.generateStudyGuide = void 0;
const genai_1 = require("@google/genai");
const Module_1 = __importDefault(require("../models/Module"));
const generateStudyGuide = async (req, res) => {
    try {
        const { moduleCode } = req.body;
        const module = await Module_1.default.findOne({ code: moduleCode });
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }
        if (!process.env.GEMINI_API_KEY) {
            res.status(500).json({ message: 'Gemini API Key is missing in backend .env file.' });
            return;
        }
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });
        const prompt = `You are an expert engineering tutor. Create a well-structured study guide for an engineering module called "${module.name}" (Code: ${module.code}). Include key concepts, learning objectives, and a short practice question. Keep it concise and use markdown formatting.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.status(200).json({ content: response.text || 'No response generated.' });
    }
    catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ message: error.message || 'Failed to generate study guide', details: error.toString() });
    }
};
exports.generateStudyGuide = generateStudyGuide;
const chat = async (req, res) => {
    try {
        const { message, moduleCode } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            res.status(500).json({ message: 'Gemini API Key is missing in backend .env file.' });
            return;
        }
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });
        const prompt = `You are a helpful teaching assistant for the engineering module ${moduleCode}. Answer the following student question concisely: "${message}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.status(200).json({ reply: response.text || 'No response generated.' });
    }
    catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ message: error.message || 'Chat failed', details: error.toString() });
    }
};
exports.chat = chat;
