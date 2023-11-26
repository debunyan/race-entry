import * as MongoDb from "mongodb";
import RaceRoutePoint from "./race-route-point";

/**
 * Race
 * 
 */
export default class Race {
    constructor(
        public eventId:string,

        public title:string,
        public note:string,
        
        public route:RaceRoutePoint[],
        public distance:string,

        public created:string,
        public modified:string|null,
        public _id?: MongoDb.ObjectId
    ) {}
};
