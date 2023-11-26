"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Race の Rap
 *
 */
class RaceLap {
    constructor(raceId, userId, timestamp, routePointId, data, _id) {
        this.raceId = raceId;
        this.userId = userId;
        this.timestamp = timestamp;
        this.routePointId = routePointId;
        this.data = data;
        this._id = _id;
    }
}
exports.default = RaceLap;
