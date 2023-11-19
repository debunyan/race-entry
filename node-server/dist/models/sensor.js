"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sensor {
    constructor(eventId, type, note, created, modified, _id) {
        this.eventId = eventId;
        this.type = type;
        this.note = note;
        this.created = created;
        this.modified = modified;
        this._id = _id;
    }
}
exports.default = Sensor;
;
