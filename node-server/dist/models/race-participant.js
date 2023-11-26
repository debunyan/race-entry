"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Race の参加者
 *
 */
class RaceParticipant {
    constructor(eventId, raceId, userId, status, result, resultTime, created, modified, _id) {
        this.eventId = eventId;
        this.raceId = raceId;
        this.userId = userId;
        this.status = status;
        this.result = result;
        this.resultTime = resultTime;
        this.created = created;
        this.modified = modified;
        this._id = _id;
    }
}
exports.default = RaceParticipant;
