"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Hash password
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        // Create user
        const newUser = new User_1.default({
            name,
            email,
            passwordHash,
        });
        await newUser.save();
        // Create token
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, points: newUser.points } });
    }
    catch (error) {
        console.error('Registration error', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email);
        const user = await User_1.default.findOne({ email });
        if (!user) {
            console.log('User not found in DB');
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        console.log('User found in DB:', user.email);
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, points: user.points } });
    }
    catch (error) {
        console.error('Login error', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
exports.login = login;
