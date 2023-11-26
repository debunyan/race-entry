import dotenv from "dotenv";
import * as mongoDB from "mongodb";
import RaceEvent from "../models/race-event";
import Sensor from "../models/sensor";
import Spot from "../models/spot";
import File from "../models/file";
import User from "../models/user";

import Race from "../models/race";
import RaceRoutePoint from "../models/race-route-point";
import RaceParticipant from "../models/race-participant";
import RaceLap from "../models/race-lap";
import RaceEventLog from "../models/race-event-log";

export const collections: {
    users?: mongoDB.Collection<User>,
    events?: mongoDB.Collection<RaceEvent>,
    sensors?: mongoDB.Collection<Sensor>,
    spots?: mongoDB.Collection<Spot>,
    races?: mongoDB.Collection<Race>,
    raceRoutePoints?: mongoDB.Collection<RaceRoutePoint>,
    raceParticipants?: mongoDB.Collection<RaceParticipant>,
    raceLaps?: mongoDB.Collection<RaceLap>,
    raceEventLogs?: mongoDB.Collection<RaceEventLog>,
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
        collections.users = db.collection<User>('users');
        collections.events = db.collection<RaceEvent>('events');
        collections.sensors = db.collection<Sensor>('sensors');
        collections.spots = db.collection<Spot>('spots');

        collections.races = db.collection<Race>('races');
        collections.raceRoutePoints = db.collection<RaceRoutePoint>('raceRoutePoints');
        collections.raceParticipants = db.collection<RaceParticipant>('raceParticipants');
        collections.raceLaps = db.collection<RaceLap>('raceLaps');
        collections.raceEventLogs = db.collection<RaceEventLog>('raceEventLogs');

        collections.files = db.collection<File>('files');
    } catch (e) {
        console.log("DB error")
        throw e;
    }
}
