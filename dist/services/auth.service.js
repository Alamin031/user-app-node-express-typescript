"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthService = void 0;
const user_entity_1 = require("../models/user.entity");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const passwordResetToken_entity_1 = require("../models/passwordResetToken.entity");
const nodemailer_1 = __importDefault(require("nodemailer"));
const otp_generator_1 = __importDefault(require("otp-generator"));
class AuthService {
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield bcryptjs_1.default.genSalt();
                data.password = yield bcryptjs_1.default.hash(data.password, salt);
                const user = new user_entity_1.User(data);
                console.log(user);
                yield user.save();
                return user;
            }
            catch (error) {
                throw new Error("Registration failed: " + error.message);
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_entity_1.User.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            return token;
        });
    }
    initiatePasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = this.generateOTP();
                const expiration = new Date();
                expiration.setMinutes(expiration.getMinutes() + 15);
                const resetToken = new passwordResetToken_entity_1.PasswordResetToken({
                    email,
                    otp,
                    expiresAt: expiration,
                });
                yield resetToken.save();
                yield this.sendOTPEmail(email, otp);
            }
            catch (error) {
                throw new Error("Password reset initiation failed: " + error.message);
            }
        });
    }
    completePasswordReset(email, otp, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resetToken = yield passwordResetToken_entity_1.PasswordResetToken.findOne({ email, otp });
                if (!resetToken || resetToken.expiresAt < new Date()) {
                    throw new Error("Invalid or expired OTP");
                }
                const salt = yield bcryptjs_1.default.genSalt();
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, salt);
                yield user_entity_1.User.findOneAndUpdate({ email }, { password: hashedPassword });
                yield resetToken.deleteOne();
            }
            catch (error) {
                throw new Error("Password reset failed: " + error.message);
            }
        });
    }
    generateOTP() {
        const otp = otp_generator_1.default.generate(6, { digits: true });
        return otp;
    }
    sendOTPEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Password Reset OTP",
                    text: `
        Dear customer,
        You have requested to reset your password for your account:
        ${email}
        Use the following one-time password (OTP) to complete the process.
        Verification Code: ${otp} 
        Please enter this code on the password reset page to verify your identity.
        This code will expire after a certain duration for security purposes.
        Best regards,`,
                };
                yield transporter.sendMail(mailOptions);
            }
            catch (error) {
                throw new Error("Email sending failed: " + error.message);
            }
        });
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
