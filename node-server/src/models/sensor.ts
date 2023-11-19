import * as MongoDb from "mongodb";

export default class Sensor {
    constructor(
        public eventId:string,
        public type:string,
        public note:number,
        public created:string,
        public modified:string|null,
        public _id?: MongoDb.UUID
    ) {}
};
