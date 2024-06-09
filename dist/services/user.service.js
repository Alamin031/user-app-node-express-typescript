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
exports.UserService = void 0;
const user_entity_1 = require("../models/user.entity");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userProfile = yield user_entity_1.User.findById(userId);
                if (!userProfile) {
                    throw new Error("User profile not found");
                }
                const { _id, name, email, profession, interests, bio, Number } = userProfile;
                return { _id, name, email, profession, interests, bio, Number };
            }
            catch (error) {
                throw new Error("Fetching user profile failed: " + error.message);
            }
        });
    }
    updateUserProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_entity_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                if (data.password) {
                    const salt = yield bcryptjs_1.default.genSalt();
                    data.password = yield bcryptjs_1.default.hash(data.password, salt);
                }
                const updatedUserProfile = yield user_entity_1.User.findByIdAndUpdate(userId, data, {
                    new: true,
                });
                return updatedUserProfile;
            }
            catch (error) {
                throw new Error("Updating user profile failed: " + error.message);
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedUser = yield user_entity_1.User.findByIdAndDelete(userId);
                return deletedUser ? deletedUser.toObject() : null;
            }
            catch (error) {
                throw new Error("Deleting user failed: " + error.message);
            }
        });
    }
}
exports.UserService = UserService;
exports.default = new UserService();
