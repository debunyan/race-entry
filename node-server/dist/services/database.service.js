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
exports.connectToDatabase = exports.collections = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoDB = __importStar(require("mongodb"));
exports.collections = {};
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            dotenv_1.default.config();
            const mongoConnectionString = 'mongodb://' + process.env.MOUNTAIN_DB +
                ':' + process.env.MOUNTAIN_PASSWORD + '@' + process.env.MONGODB_HOST +
                '/' + process.env.MOUNTAIN_DB;
            console.log("DB: " + mongoConnectionString);
            const client = new mongoDB.MongoClient(mongoConnectionString);
            yield client.connect();
            const db = client.db(process.env.MOUNTAIN_DB);
            exports.collections.users = db.collection('users');
            exports.collections.events = db.collection('events');
            exports.collections.sensors = db.collection('sensors');
            exports.collections.spots = db.collection('spots');
            exports.collections.races = db.collection('races');
            exports.collections.raceRoutePoints = db.collection('raceRoutePoints');
            exports.collections.raceParticipants = db.collection('raceParticipants');
            exports.collections.raceLaps = db.collection('raceLaps');
            exports.collections.raceEventLogs = db.collection('raceEventLogs');
            exports.collections.files = db.collection('files');
        }
        catch (e) {
            console.log("DB error");
            throw e;
        }
    });
}
exports.connectToDatabase = connectToDatabase;
