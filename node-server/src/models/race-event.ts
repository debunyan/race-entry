import * as MongoDb from "mongodb";

/**
 * トレランやオリエンテーリングなどのイベント
 * 
 */
export default class RaceEvent {
    constructor(
        public title:string,
        public note:string,
        public created:string,
        public modified:string|null,
        public _id?: MongoDb.ObjectId
    ) {}
};
