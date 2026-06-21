import { Request, Response } from 'express';
import Module from '../models/Module';
import Department from '../models/Department';

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments', error });
  }
};

export const getModules = async (req: Request, res: Response) => {
  try {
    const modules = await Module.find().populate('department');
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules', error });
  }
};

export const getModuleByCode = async (req: Request, res: Response) => {
  try {
    const module = await Module.findOne({ code: req.params.code }).populate('department');
    if (!module) {
       res.status(404).json({ message: 'Module not found' });
       return;
    }
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching module', error });
  }
};
