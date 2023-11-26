"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Race のコースを構成する位置
 *
 */
class RaceRoutePoint {
    constructor(raceId, order, spotId, title, note, created, modified, _id) {
        this.raceId = raceId;
        this.order = order;
        this.spotId = spotId;
        this.title = title;
        this.note = note;
        this.created = created;
        this.modified = modified;
        this._id = _id;
    }
}
exports.default = RaceRoutePoint;
