"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * トレランやオリエンテーリングなどのイベント
 *
 */
class Event {
    constructor(title, note, created, modified, _id) {
        this.title = title;
        this.note = note;
        this.created = created;
        this.modified = modified;
        this._id = _id;
    }
}
exports.default = Event;
;
class Event {
    constructor(fileName, mimeType, accessUrl, size, created, modified, _id) {
        this.fileName = fileName;
        this.mimeType = mimeType;
        this.accessUrl = accessUrl;
        this.size = size;
        this.created = created;
        this.modified = modified;
        this._id = _id;
    }
}
exports.default = Event;
;
