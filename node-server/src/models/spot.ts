import * as MongoDb from "mongodb";

export type GPSCoordinates = {
    latitude: number,
    longitude: number,
    altitude: number
}

/**
 * 地点を表す
 * 
 */
export default class Spot {
    constructor(
        public eventId:string,
        public name:string,
        public order:number,
        public movable:boolean, // 移動するスポットは true
        public description:string,

        // 論理位置
        public gpsCoordinates:GPSCoordinates|null,
        public radius:number, // 半径

        // 現地の目印
        public flag:string, // その地点に設置される目印の情報
        public sensorId:string|null, // その地点に設置される接近・通過センサーの情報
        public navigationNote:string, // 目印やセンサーの設置位置に関する詳細な説明（無くさないために

        public created:string,
        public modified:string|null,
        public _id?: MongoDb.ObjectId
    ) {}
};
