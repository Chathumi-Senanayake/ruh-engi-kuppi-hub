"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const module_routes_1 = __importDefault(require("./routes/module.routes"));
const resource_routes_1 = __importDefault(require("./routes/resource.routes"));
const search_routes_1 = __importDefault(require("./routes/search.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT || 5000;
// Serve static uploads
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Basic health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'RUHEngiKuppiHub API is running' });
});
// Temporary Database Seeding Route
app.get('/api/seed-database', (req, res) => {
    try {
        const { execSync } = require('child_process');
        execSync('node dist/seeder.js');
        res.status(200).json({ message: 'Database successfully seeded! You can now log in with admin / admin1234.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to seed database', error: String(error) });
    }
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/modules', module_routes_1.default);
app.use('/api/resources', resource_routes_1.default);
app.use('/api/search', search_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ruhengikuppihub';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
});
