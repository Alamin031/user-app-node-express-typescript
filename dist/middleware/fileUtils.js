"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOldFile = void 0;
const fs_1 = __importDefault(require("fs"));
function removeOldFile(filePath) {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            console.log(`Old file at ${filePath} has been removed.`);
        }
    }
    catch (error) {
        console.error(`Error removing old file: ${error}`);
    }
}
exports.removeOldFile = removeOldFile;
