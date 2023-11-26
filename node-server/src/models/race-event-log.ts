import * as MongoDb from "mongodb";

/**
 * 
 * 
 */
export default class RaceEventLog {
    constructor(
        public timestamp:string,
        public eventId:string,
        public raceId:string,
        public userId:string,

        public action:string,
        public detail:string,
        public data:object,

        public _id?: MongoDb.ObjectId
    ) {}
}