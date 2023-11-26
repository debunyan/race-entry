"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 *
 */
class RaceEventLog {
    constructor(timestamp, eventId, raceId, userId, action, detail, data, _id) {
        this.timestamp = timestamp;
        this.eventId = eventId;
        this.raceId = raceId;
        this.userId = userId;
        this.action = action;
        this.detail = detail;
        this.data = data;
        this._id = _id;
    }
}
exports.default = RaceEventLog;
