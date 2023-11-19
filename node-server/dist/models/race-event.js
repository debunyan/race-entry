"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * トレランやオリエンテーリングなどのイベント
 *
 */
class RaceEvent {
    constructor(title, note, created, modified, _id) {
        this.title = title;
        this.note = note;
        this.created = created;
        this.modified = modified;
        this._id = _id;
    }
}
exports.default = RaceEvent;
;
