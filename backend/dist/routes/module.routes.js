"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const module_controller_1 = require("../controllers/module.controller");
const router = (0, express_1.Router)();
router.get('/departments', module_controller_1.getDepartments);
router.get('/', module_controller_1.getModules);
router.get('/:code', module_controller_1.getModuleByCode);
exports.default = router;
