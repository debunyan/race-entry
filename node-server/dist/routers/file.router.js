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
exports.fileRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
exports.fileRouter = express_1.default.Router();
const storeBaseDir = '/uploads';
dotenv_1.default.config();
exports.fileRouter.get("/:name", function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const name = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.name;
        try {
            const query = { accessUrl: process.env.BASEURL + storeBaseDir + '/' + encodeURIComponent(name) };
            const file = (yield ((_b = database_service_1.collections.files) === null || _b === void 0 ? void 0 : _b.findOne(query)));
            if (file && file._id) {
                const storePath = path_1.default.resolve(storeBaseDir, file._id.toString());
                res.contentType(file.mimeType);
                res.status(200).sendFile(storePath);
            }
            else {
                res.status(404).send('not found');
            }
        }
        catch (e) {
            res.status(300).json({ error: e });
        }
    });
});
