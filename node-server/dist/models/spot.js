"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 地点を表す
 *
 */
class Spot {
    constructor(eventId, name, order, movable, // 移動するスポットは true
    description, 
    // 論理位置
    gpsCoordinates, radius, // 半径
    // 現地の目印
    flag, // その地点に設置される目印の情報
    sensorId, // その地点に設置される接近・通過センサーの情報
    navigationNote, // 目印やセンサーの設置位置に関する詳細な説明（無くさないために
    created, modified, _id) {
        this.eventId = eventId;
        this.name = name;
        this.order = order;
        this.movable = movable;
        this.description = description;
        this.gpsCoordinates = gpsCoordinates;
        this.radius = radius;
        this.flag = flag;
        this.sensorId = sensorId;
        this.navigationNote = navigationNote;
        this.created = created;
        this.modified = modified;
        this._id = _id;
    }
}
exports.default = Spot;
;
