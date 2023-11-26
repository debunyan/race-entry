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
exports.eventRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
const mongodb_1 = require("mongodb");
exports.eventRouter = express_1.default.Router();
exports.eventRouter.get("/:id", function (req, res, next) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = new mongodb_1.ObjectId((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
            const query = { _id: id };
            const event = (yield ((_b = database_service_1.collections.events) === null || _b === void 0 ? void 0 : _b.findOne(query)));
            if (!event) {
                res.status(404).send('not found');
            }
            const users = (yield ((_c = database_service_1.collections.users) === null || _c === void 0 ? void 0 : _c.find({}).toArray()));
            const sensorQuery = { eventId: id.toString() };
            const sensors = (yield ((_d = database_service_1.collections.sensors) === null || _d === void 0 ? void 0 : _d.find(sensorQuery).toArray()));
            const spots = (yield ((_e = database_service_1.collections.spots) === null || _e === void 0 ? void 0 : _e.find(sensorQuery).sort('order').toArray()));
            const races = (yield ((_f = database_service_1.collections.races) === null || _f === void 0 ? void 0 : _f.find(sensorQuery).toArray()));
            res.status(200);
            res.render('event.ejs', { event, sensors, spots, users, races });
        }
        catch (e) {
            res.status(300).json({ error: e });
        }
    });
});
exports.eventRouter.get("/:id/race/:raceId", function (req, res, next) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = new mongodb_1.ObjectId((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
            const query = { _id: id };
            const event = (yield ((_b = database_service_1.collections.events) === null || _b === void 0 ? void 0 : _b.findOne(query)));
            if (!event) {
                res.status(404).send('not found');
                return;
            }
            const raceId = new mongodb_1.ObjectId((_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.raceId);
            const raceQuery = { _id: raceId };
            const race = (yield ((_d = database_service_1.collections.races) === null || _d === void 0 ? void 0 : _d.findOne(raceQuery)));
            if (!race) {
                res.status(404).send('not found');
                return;
            }
            const raceRTQuery = { raceId: raceId.toString() };
            const raceRoutePoints = (yield ((_e = database_service_1.collections.raceRoutePoints) === null || _e === void 0 ? void 0 : _e.find(raceRTQuery).sort('order').toArray()));
            const raceParticipants = (yield ((_f = database_service_1.collections.raceParticipants) === null || _f === void 0 ? void 0 : _f.find(raceRTQuery).toArray()));
            const raceRoutePointsById = new Map();
            raceRoutePoints.forEach((val) => {
                if (!val._id) {
                    return;
                }
                raceRoutePointsById.set(val._id.toString(), val);
            });
            const users = (yield ((_g = database_service_1.collections.users) === null || _g === void 0 ? void 0 : _g.find({}).toArray()));
            const usersById = new Map();
            users.forEach((user) => {
                if (!user._id) {
                    return;
                }
                usersById.set(user._id.toString(), user);
            });
            const raceParicipantUsers = new Array();
            raceParticipants.forEach((raceParticipant) => {
                const user = usersById.get(raceParticipant.userId);
                if (user) {
                    raceParicipantUsers.push(user);
                }
            });
            const sensorQuery = { eventId: id.toString() };
            const sensors = (yield ((_h = database_service_1.collections.sensors) === null || _h === void 0 ? void 0 : _h.find(sensorQuery).toArray()));
            const spots = (yield ((_j = database_service_1.collections.spots) === null || _j === void 0 ? void 0 : _j.find(sensorQuery).sort('order').toArray()));
            const spotsById = new Map();
            spots.forEach((spot) => {
                var _a;
                if (!spot._id) {
                    return;
                }
                spotsById.set((_a = spot._id) === null || _a === void 0 ? void 0 : _a.toString(), spot);
            });
            const sensorsById = new Map();
            sensors.forEach((sensor) => {
                if (!sensor._id) {
                    return;
                }
                sensorsById.set(sensor._id.toString(), sensor);
            });
            const raceLaps = (yield ((_k = database_service_1.collections.raceLaps) === null || _k === void 0 ? void 0 : _k.find(raceRTQuery).sort('timestamp').toArray()));
            res.status(200);
            res.render('race.ejs', { event, race, raceRoutePoints, raceParicipantUsers, spotsById, spots, sensors, sensorsById,
                users, usersById, raceLaps, raceRoutePointsById });
        }
        catch (e) {
            res.status(300).json({ error: e });
        }
    });
});
