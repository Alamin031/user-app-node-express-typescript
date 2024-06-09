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
exports.auth = exports.SECRET_KEY = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_entity_1 = require("../models/user.entity");
exports.SECRET_KEY = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC8k3x3Wi9V3kMkYu9tjDaSRD2cBjOgp3FQU/Gndlced9WsaVNx3lgkbbS47sPpFMdQVSgmGbRqhaj9vUrD56+QOMn5HuxeAp5VMwwD$";
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        console.log(token);
        if (!token) {
            throw new Error("Please authenticate");
        }
        const decoded = jsonwebtoken_1.default.verify(token, exports.SECRET_KEY);
        const user = yield user_entity_1.User.findOne({
            _id: decoded.userId,
        });
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user.toObject(); // Convert user to plain object
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).send({ error: "Invalid token" });
        }
        else {
            res.status(401).send({ error: "Please authenticate?" });
        }
    }
});
exports.auth = auth;
