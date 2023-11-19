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
exports.noteApiRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongoDB = __importStar(require("mongodb"));
const database_service_1 = require("../services/database.service");
exports.noteApiRouter = express_1.default.Router();
exports.noteApiRouter.use(express_1.default.json());
exports.noteApiRouter.get("/", function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notes = (yield ((_a = database_service_1.collections.notes) === null || _a === void 0 ? void 0 : _a.find({}).toArray()));
            res.status(200).json(notes);
        }
        catch (e) {
            res.status(300).json({ error: e });
        }
    });
});
exports.noteApiRouter.post("/", function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newNote = req.body;
            const result = yield ((_a = database_service_1.collections.notes) === null || _a === void 0 ? void 0 : _a.insertOne(newNote));
            result
                ? res.status(201).json({ 'id': (yield result).insertedId })
                : res.status(500).json({ 'message': "failed" });
        }
        catch (e) {
            res.status(400).json({ error: e });
        }
    });
});
exports.noteApiRouter.get("/:id", function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        try {
            const query = { _id: new mongoDB.ObjectId(id) };
            const note = (yield ((_b = database_service_1.collections.notes) === null || _b === void 0 ? void 0 : _b.findOne(query)));
            if (note) {
                res.status(200).json(note);
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
exports.noteApiRouter.put("/:id", function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        try {
            // _id が残っていると MongoDB はアップデートしてくれない
            const updatedNote = req.body;
            delete updatedNote._id;
            const query = { _id: new mongoDB.ObjectId(id) };
            const result = yield ((_b = database_service_1.collections.notes) === null || _b === void 0 ? void 0 : _b.replaceOne(query, updatedNote));
            result
                ? res.status(201).json({ 'id': id })
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
exports.noteApiRouter.delete("/:id", function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        try {
            const query = { _id: new mongoDB.ObjectId(id) };
            const result = yield ((_b = database_service_1.collections.notes) === null || _b === void 0 ? void 0 : _b.deleteOne(query));
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
