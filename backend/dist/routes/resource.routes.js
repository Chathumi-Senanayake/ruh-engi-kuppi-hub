"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const resource_controller_1 = require("../controllers/resource.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage });
router.post('/', auth_middleware_1.protect, upload.single('file'), resource_controller_1.createResource);
router.get('/:moduleCode', resource_controller_1.getResourcesByModule);
router.put('/:id', auth_middleware_1.protect, auth_middleware_1.admin, resource_controller_1.updateResource);
router.delete('/:id', auth_middleware_1.protect, auth_middleware_1.admin, resource_controller_1.deleteResource);
exports.default = router;
