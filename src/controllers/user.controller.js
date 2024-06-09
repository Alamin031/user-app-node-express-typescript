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
exports.deleteUser = exports.updateUserProfile = exports.getUserProfile = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
// Show profile
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const userProfile = yield user_service_1.default.getUserProfile(userId);
        if (!userProfile) {
            return res.status(404).json({ error: "User profile not found" });
        }
        res.status(200).json(userProfile);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getUserProfile = getUserProfile;
// Update user profile route
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const data = req.body;
        const updatedUserProfile = yield user_service_1.default.updateUserProfile(userId, data);
        res.status(200).json(updatedUserProfile);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
exports.updateUserProfile = updateUserProfile;
// Delete user route
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const deletedUser = yield user_service_1.default.deleteUser(userId);
        res.status(200).json(deletedUser);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
exports.deleteUser = deleteUser;
