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
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = new mongodb_1.ObjectId((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
            const query = { _id: id };
            const event = (yield ((_b = database_service_1.collections.events) === null || _b === void 0 ? void 0 : _b.findOne(query)));
            if (!event) {
                res.status(404).send('not found');
            }
            const sensorQuery = { eventId: id.toString() };
            const sensors = (yield ((_c = database_service_1.collections.sensors) === null || _c === void 0 ? void 0 : _c.find(sensorQuery).toArray()));
            const spots = (yield ((_d = database_service_1.collections.spots) === null || _d === void 0 ? void 0 : _d.find(sensorQuery).sort('order').toArray()));
            console.log(spots);
            res.status(200);
            res.render('event.ejs', { event, sensors, spots });
        }
        catch (e) {
            res.status(300).json({ error: e });
        }
    });
});
