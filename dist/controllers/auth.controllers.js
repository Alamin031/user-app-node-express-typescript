"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.signup = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
const user_entity_1 = require("../models/user.entity");
//signup route
// Sign-up route
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const newUser = yield auth_service_1.default.signup(data);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.signup = signup;
// Login route
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const token = yield auth_service_1.default.login(email, password);
        console.log(token);
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
exports.login = login;
// Forgot password route
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_entity_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        yield auth_service_1.default.initiatePasswordReset(email);
        res.status(200).json({ message: 'Password reset initiated. Check your email for OTP.' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        yield auth_service_1.default.completePasswordReset(email, otp, newPassword);
        res.status(200).json({ message: 'Password reset successful.' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.resetPassword = resetPassword;
