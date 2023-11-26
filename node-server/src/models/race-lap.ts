import * as MongoDb from "mongodb";

/**
 * Race の Rap
 * 
 */
export default class RaceLap {
    constructor(
        public raceId:string,
        public userId:string,

        public timestamp:string,
        public routePointId:string,
        public data:string,

        public _id?: MongoDb.ObjectId

    ) {}
}