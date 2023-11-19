import dotenv from "dotenv";
import * as mongoDB from "mongodb";
import RaceEvent from "../models/race-event";
import Sensor from "../models/sensor";
import Spot from "../models/spot";
import File from "../models/file";
export const collections: {
    events?: mongoDB.Collection<RaceEvent>,
    sensors?: mongoDB.Collection<Sensor>,
    spots?: mongoDB.Collection<Spot>,
    files?: mongoDB.Collection<File>
} = {}

export async function connectToDatabase() {
    try {
        dotenv.config();
        const mongoConnectionString = 'mongodb://' + process.env.MOUNTAIN_DB +
            ':' + process.env.MOUNTAIN_PASSWORD + '@' + process.env.MONGODB_HOST +
             '/' + process.env.MOUNTAIN_DB;
        console.log("DB: " + mongoConnectionString);

        const client: mongoDB.MongoClient = new mongoDB.MongoClient(mongoConnectionString);
        await client.connect();

        const db: mongoDB.Db = client.db(process.env.MOUNTAIN_DB);
        collections.events = db.collection<RaceEvent>('events');
        collections.sensors = db.collection<Sensor>('sensors');
        collections.spots = db.collection<Spot>('spots');
        collections.files = db.collection<File>('files');
    } catch (e) {
        console.log("DB error")
        throw e;
    }
}
