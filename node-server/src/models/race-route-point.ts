import * as MongoDb from "mongodb";
import Spot from "./spot";

/**
 * Race のコースを構成する位置
 * 
 */
export default class RaceRoutePoint {
    constructor(
        public raceId:string,
        public order:number,
        public spotId:string,

        public title:string,
        public note:string,

        public created:string,
        public modified:string|null,
        public _id?: MongoDb.ObjectId

    ) {}
}