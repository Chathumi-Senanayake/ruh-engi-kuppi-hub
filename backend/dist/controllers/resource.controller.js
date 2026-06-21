"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.updateResource = exports.getResourcesByModule = exports.createResource = void 0;
const Resource_1 = __importDefault(require("../models/Resource"));
const User_1 = __importDefault(require("../models/User"));
const Module_1 = __importDefault(require("../models/Module"));
const createResource = async (req, res) => {
    try {
        const { title, description, type, moduleCode, link, tags, year, examType, itemNumber } = req.body;
        // Get Module ID from code
        const module = await Module_1.default.findOne({ code: moduleCode });
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }
        const userId = req.user.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Handle file upload path
        let fileUrl = '';
        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        }
        const newResource = new Resource_1.default({
            title,
            description,
            type,
            module: module._id,
            uploadedBy: user._id,
            fileUrl,
            link,
            tags: tags ? tags.split(',').map((t) => t.trim()) : [],
            year,
            examType,
            itemNumber
        });
        await newResource.save();
        // Gamification Points (Phase 11 logic)
        user.points += type === 'kuppi' ? 20 : 10;
        await user.save();
        res.status(201).json(newResource);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating resource', error });
    }
};
exports.createResource = createResource;
const getResourcesByModule = async (req, res) => {
    try {
        const { moduleCode } = req.params;
        const module = await Module_1.default.findOne({ code: moduleCode });
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }
        const resources = await Resource_1.default.find({ module: module._id })
            .populate('uploadedBy', 'name role points')
            .sort({ createdAt: -1 });
        res.status(200).json(resources);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching resources', error });
    }
};
exports.getResourcesByModule = getResourcesByModule;
const updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, link } = req.body;
        const resource = await Resource_1.default.findById(id);
        if (!resource) {
            res.status(404).json({ message: 'Resource not found' });
            return;
        }
        resource.title = title || resource.title;
        resource.description = description !== undefined ? description : resource.description;
        resource.link = link !== undefined ? link : resource.link;
        const updatedResource = await resource.save();
        res.status(200).json(updatedResource);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating resource', error });
    }
};
exports.updateResource = updateResource;
const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource_1.default.findById(id);
        if (!resource) {
            res.status(404).json({ message: 'Resource not found' });
            return;
        }
        await resource.deleteOne();
        res.status(200).json({ message: 'Resource removed' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting resource', error });
    }
};
exports.deleteResource = deleteResource;
