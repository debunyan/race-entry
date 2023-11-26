"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Race
 *
 */
class Race {
    constructor(eventId, title, note, route, distance, created, modified, _id) {
        this.eventId = eventId;
        this.title = title;
        this.note = note;
        this.route = route;
        this.distance = distance;
        this.created = created;
        this.modified = modified;
        this._id = _id;
    }
}
exports.default = Race;
;
