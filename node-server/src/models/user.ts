import * as MongoDb from "mongodb";

export default class User {
    constructor(
        public name:string,
        public note:string,
        public created:string,
        public modified:string|null,
        public _id?: MongoDb.ObjectId
    ) {}
};
