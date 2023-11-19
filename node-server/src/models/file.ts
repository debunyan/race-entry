import * as MongoDb from "mongodb";

export default class File {
    constructor(
        public fileName:string,
        public mimeType:string,
        public accessUrl:string,
        public size:number,
        public created:string,
        public modified:string,
        public _id?: MongoDb.ObjectId
    ) {}
};
