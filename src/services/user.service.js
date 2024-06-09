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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_entity_1 = require("../models/user.entity");
const bcrypt = __importStar(require("bcrypt"));
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
                    const salt = yield bcrypt.genSalt();
                    data.password = yield bcrypt.hash(data.password, salt);
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
