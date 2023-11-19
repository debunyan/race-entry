"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class File {
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
exports.default = File;
;
