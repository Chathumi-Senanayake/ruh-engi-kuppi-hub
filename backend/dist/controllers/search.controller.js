"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSearch = void 0;
const Resource_1 = __importDefault(require("../models/Resource"));
const Module_1 = __importDefault(require("../models/Module"));
const globalSearch = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            res.status(200).json({ modules: [], resources: [] });
            return;
        }
        const regex = new RegExp(query, 'i');
        const [modules, resources] = await Promise.all([
            Module_1.default.find({ $or: [{ name: regex }, { code: regex }] }).limit(5),
            Resource_1.default.find({ $or: [{ title: regex }, { description: regex }, { tags: regex }] })
                .populate('module')
                .populate('uploadedBy', 'name')
                .limit(10)
        ]);
        res.status(200).json({ modules, resources });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Search failed', error });
    }
};
exports.globalSearch = globalSearch;
