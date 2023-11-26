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
exports.publicApiRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongoDB = __importStar(require("mongodb"));
const database_service_1 = require("../services/database.service");
exports.publicApiRouter = express_1.default.Router();
/**
 * 外部に公開するAPI
 */
exports.publicApiRouter.use(express_1.default.json());
exports.publicApiRouter.post("/spot-setup", function (req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!Object.keys(req.body).includes("device-id") || typeof req.body['device-id'] !== 'string' ||
                !Object.keys(req.body).includes("time-stamp") || typeof req.body['time-stamp'] !== 'string' ||
                !Object.keys(req.body).includes("location") || !Array.isArray(req.body['location'])) {
                throw new Error("invalid parameter");
            }
            const sensorId = req.body['device-id'];
            const timeStamp = new Date(req.body['time-stamp']);
            const location = req.body['location'];
            const gpsCoordinate = {
                latitude: location[0],
                longitude: location[1],
                altitude: location[2]
            };
            const sensorQuery = { _id: new mongoDB.UUID(sensorId) };
            const sensor = (yield ((_a = database_service_1.collections.sensors) === null || _a === void 0 ? void 0 : _a.findOne(sensorQuery)));
            const spotQuery = { sensorId };
            const spots = (yield ((_b = database_service_1.collections.spots) === null || _b === void 0 ? void 0 : _b.find(spotQuery).toArray()));
            //todo センサータイプなど操作対象のチェック
            spots.forEach((spot) => {
                var _a;
                const spotQuery = { _id: new mongoDB.ObjectId(spot._id) };
                const updatedSpot = Object.assign({}, spot);
                delete updatedSpot._id;
                updatedSpot.gpsCoordinates = gpsCoordinate;
                (_a = database_service_1.collections.spots) === null || _a === void 0 ? void 0 : _a.replaceOne(spotQuery, updatedSpot);
            });
            res.status(200).json({ 'message': 'device located. affected spots:' + spots.length });
        }
        catch (e) {
            res.status(400).json({ error: e });
        }
    });
});
exports.publicApiRouter.post("/spot-checkin", function (req, res, next) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!Object.keys(req.body).includes("device-id") || typeof req.body['device-id'] !== 'string' ||
                !Object.keys(req.body).includes("time-stamp") || typeof req.body['time-stamp'] !== 'string' ||
                !Object.keys(req.body).includes("user-id") || typeof req.body['user-id'] !== 'string') {
                console.log('aa');
                throw new Error("invalid parameter");
            }
            const sensorId = req.body['device-id'];
            const timeStamp = new Date(req.body['time-stamp']);
            const userId = req.body['user-id'];
            const spotAndRoutePoints = (yield ((_a = database_service_1.collections.spots) === null || _a === void 0 ? void 0 : _a.aggregate([
                { $lookup: {
                        from: 'raceParticipants',
                        localField: 'eventId',
                        foreignField: 'eventId',
                        as: 'raceParticipants',
                        pipeline: [
                            { $match: {
                                    userId
                                }
                            }
                        ]
                    },
                },
                { $match: {
                        sensorId,
                    }
                },
            ]).toArray()));
            const candidateSpotIds = new Array();
            spotAndRoutePoints === null || spotAndRoutePoints === void 0 ? void 0 : spotAndRoutePoints.forEach((val) => {
                if (!val.raceParticipants || !val.raceParticipants.length) {
                    return;
                }
                candidateSpotIds.push(val._id.toString());
            });
            const checkinRoutePoints = (yield ((_b = database_service_1.collections.raceRoutePoints) === null || _b === void 0 ? void 0 : _b.aggregate([
                { $match: {
                        spotId: { $in: candidateSpotIds }
                    }
                },
            ]).toArray()));
            const insertLaps = new Array();
            checkinRoutePoints === null || checkinRoutePoints === void 0 ? void 0 : checkinRoutePoints.forEach((routePoint) => {
                var _a;
                if (!routePoint._id) {
                    return;
                }
                const lap = {
                    raceId: routePoint.raceId,
                    userId,
                    timestamp: timeStamp.toISOString(),
                    routePointId: (_a = routePoint._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    data: ''
                };
                insertLaps.push(lap);
            });
            const result = yield ((_c = database_service_1.collections.raceLaps) === null || _c === void 0 ? void 0 : _c.insertMany(insertLaps));
            result
                ? res.status(201).json({ 'id': (yield result).insertedIds })
                : res.status(500).json({ 'message': "failed" });
        }
        catch (e) {
            console.log(e);
            res.status(400).json({ error: e });
        }
    });
});
