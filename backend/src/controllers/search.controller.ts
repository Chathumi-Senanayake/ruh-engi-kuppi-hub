import { Request, Response } from 'express';
import Resource from '../models/Resource';
import Module from '../models/Module';

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
        res.status(200).json({ modules: [], resources: [] });
        return;
    }

    const regex = new RegExp(query, 'i');

    const [modules, resources] = await Promise.all([
      Module.find({ $or: [{ name: regex }, { code: regex }] }).limit(5),
      Resource.find({ $or: [{ title: regex }, { description: regex }, { tags: regex }] })
        .populate('module')
        .populate('uploadedBy', 'name')
        .limit(10)
    ]);

    res.status(200).json({ modules, resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Search failed', error });
  }
};
