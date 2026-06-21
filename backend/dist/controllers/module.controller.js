"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleByCode = exports.getModules = exports.getDepartments = void 0;
const Module_1 = __importDefault(require("../models/Module"));
const Department_1 = __importDefault(require("../models/Department"));
const getDepartments = async (req, res) => {
    try {
        const departments = await Department_1.default.find();
        res.status(200).json(departments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error });
    }
};
exports.getDepartments = getDepartments;
const getModules = async (req, res) => {
    try {
        const modules = await Module_1.default.find().populate('department');
        res.status(200).json(modules);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching modules', error });
    }
};
exports.getModules = getModules;
const getModuleByCode = async (req, res) => {
    try {
        const module = await Module_1.default.findOne({ code: req.params.code }).populate('department');
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }
        res.status(200).json(module);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching module', error });
    }
};
exports.getModuleByCode = getModuleByCode;
