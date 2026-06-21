import { Request, Response } from 'express';
import axios from 'axios';
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

    const prompt = `You are an expert engineering tutor. Create a well-structured study guide for an engineering module called "${module.name}" (Code: ${module.code}). Include key concepts, learning objectives, and a short practice question. Keep it concise and use markdown formatting.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        } 
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    res.status(200).json({ content: text });
  } catch (error: any) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to generate study guide', error: error.response?.data || error.message });
  }
};

export const chat = async (req: Request, res: Response) => {
  try {
    const { message, moduleCode } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({ message: 'Gemini API Key is missing in backend .env file.' });
        return;
    }

    const prompt = `You are a helpful teaching assistant for the engineering module ${moduleCode}. Answer the following student question concisely: "${message}"`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        } 
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Chat failed', error: error.response?.data || error.message });
  }
};
