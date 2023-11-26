import * as MongoDb from "mongodb";

/**
 * Race の参加者
 * 
 */
export default class RaceParticipant {
    constructor(
        public eventId:string,
        public raceId:string,
        public userId:string,

        public status:string,
        public result:string,
        public resultTime:string,

        public created:string,
        public modified:string|null,
        public _id?: MongoDb.ObjectId

    ) {}
}