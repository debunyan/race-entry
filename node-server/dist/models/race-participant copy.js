"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Race の参加者
 *
 */
class RaceParticipant {
    constructor(raceId, userId, status, result, ractTime, created, modified, _id) {
        this.raceId = raceId;
        this.userId = userId;
        this.status = status;
        this.result = result;
        this.ractTime = ractTime;
        this.created = created;
        this.modified = modified;
        this._id = _id;
    }
}
exports.default = RaceParticipant;
