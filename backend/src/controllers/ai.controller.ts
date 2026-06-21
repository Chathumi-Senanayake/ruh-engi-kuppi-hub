import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import Module from '../models/Module';

export const generateStudyGuide = async (req: Request, res: Response) => {
  try {
    const { moduleCode } = req.body;
    
    const module = await Module.findOne({ code: moduleCode });
    if (!module) {
        res.status(404).json({ message: 'Module not found' });
        return;
    }

    if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({ message: 'Gemini API Key is missing in backend .env file.' });
        return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });
    const prompt = `You are an expert engineering tutor. Create a well-structured study guide for an engineering module called "${module.name}" (Code: ${module.code}). Include key concepts, learning objectives, and a short practice question. Keep it concise and use markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({ content: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate study guide', details: error.toString() });
  }
};

export const chat = async (req: Request, res: Response) => {
  try {
    const { message, moduleCode } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({ message: 'Gemini API Key is missing in backend .env file.' });
        return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });
    const prompt = `You are a helpful teaching assistant for the engineering module ${moduleCode}. Answer the following student question concisely: "${message}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({ reply: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ message: error.message || 'Chat failed', details: error.toString() });
  }
};
