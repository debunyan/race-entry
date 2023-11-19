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
exports.fileApiRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const mongoDB = __importStar(require("mongodb"));
const database_service_1 = require("../services/database.service");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
exports.fileApiRouter = express_1.default.Router();
const storeBaseDir = '/uploads';
dotenv_1.default.config();
exports.fileApiRouter.use(express_1.default.json());
// 文字コードを指定しないとファイル名が化ける
exports.fileApiRouter.use((0, express_fileupload_1.default)({
    uriDecodeFileNames: true,
    defCharset: 'utf8',
    defParamCharset: 'utf8'
}));
exports.fileApiRouter.get("/", function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = (yield ((_a = database_service_1.collections.files) === null || _a === void 0 ? void 0 : _a.find({}).toArray()));
            res.status(200).json(files);
        }
        catch (e) {
            res.status(300).json({ error: e });
        }
    });
});
exports.fileApiRouter.post("/", function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newFile = req.body;
            if (!req.files || !req.files.file) {
                throw new Error('file was not uploaded');
            }
            const file = req.files.file;
            console.log(file);
            if (file && !Array.isArray(file)) {
                newFile.fileName = file.name;
                newFile.size = file.size;
                newFile.mimeType = file.mimetype;
                newFile.accessUrl = new URL(process.env.BASEURL + '/uploads/' + encodeURIComponent(newFile.fileName)).toString();
                newFile.created = new Date().toISOString();
                newFile.modified = new Date().toISOString();
                const query = { accessUrl: process.env.BASEURL + storeBaseDir + '/' + encodeURIComponent(newFile.fileName) };
                const fileAlreadyUploaded = (yield ((_a = database_service_1.collections.files) === null || _a === void 0 ? void 0 : _a.findOne(query)));
                if (fileAlreadyUploaded) {
                    res.status(200).json(fileAlreadyUploaded);
                    console.log('file already uploaded');
                    return;
                }
                const result = yield ((_b = database_service_1.collections.files) === null || _b === void 0 ? void 0 : _b.insertOne(newFile));
                if (result) {
                    const newFileId = (yield result).insertedId;
                    console.log(newFileId);
                    const storePath = path_1.default.resolve(storeBaseDir, newFileId.toString());
                    console.log(storePath);
                    fs.writeFileSync(storePath, file.data);
                    newFile._id = newFileId;
                    res.status(201).json(newFile);
                }
                else {
                    res.status(500).json({ 'message': "failed" });
                }
            }
            else {
                res.status(500).json({ 'message': "failed" });
            }
        }
        catch (e) {
            res.status(400).json({ error: e });
        }
    });
});
exports.fileApiRouter.get("/:id", function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        try {
            const query = { _id: new mongoDB.ObjectId(id) };
            const file = (yield ((_b = database_service_1.collections.files) === null || _b === void 0 ? void 0 : _b.findOne(query)));
            if (file) {
                res.status(200).json(file);
            }
            else {
                console.log('error ? ');
            }
        }
        catch (e) {
            res.status(300).json({ error: e });
        }
    });
});
exports.fileApiRouter.put("/:id", function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        try {
            // _id が残っていると MongoDB はアップデートしてくれない
            const updatedFile = req.body;
            delete updatedFile._id;
            const query = { _id: new mongoDB.ObjectId(id) };
            const result = yield ((_b = database_service_1.collections.files) === null || _b === void 0 ? void 0 : _b.replaceOne(query, updatedFile));
            result
                ? res.status(201).json({ 'message': 'updated', 'id': id })
                : res.status(500).json({ 'message': "failed" });
        }
        catch (e) {
            console.error('update error', e);
            console.error(id, req.body);
            console.error('query', { _id: new mongoDB.ObjectId(id) });
            res.status(300).json({ error: e });
        }
    });
});
exports.fileApiRouter.delete("/:id", function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        try {
            const query = { _id: new mongoDB.ObjectId(id) };
            const result = yield ((_b = database_service_1.collections.files) === null || _b === void 0 ? void 0 : _b.deleteOne(query));
            if (result && (yield result).deletedCount) {
                res.status(202).json({ 'id': id });
            }
            else if (!result) {
                res.status(400).json({ 'id': id });
            }
            else if (!(yield result).deletedCount) {
                res.status(404).json({ 'id': id });
            }
        }
        catch (e) {
            res.status(300).json({ error: e });
        }
    });
});
