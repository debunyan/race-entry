import express, { Request, Response } from "express";
import {collections} from "../services/database.service";
import RaceEvent from "../models/race-event";
import Sensor from "../models/sensor";
import Spot from "../models/spot";
import { ObjectId } from "mongodb";
import User from "../models/user";
import Race from "../models/race";
import RaceRoutePoint from "../models/race-route-point";
import RaceParticipant from "../models/race-participant";
import RaceLap from "../models/race-lap";

export const eventRouter = express.Router();

eventRouter.get("/:id", async function(req:Request, res:Response, next){
    try {
        const id:ObjectId = new ObjectId(req?.params?.id);
        const query = {_id: id };
        const event = (await collections.events?.findOne(query)) as RaceEvent;
        if (!event) {
            res.status(404).send('not found');
        }

        const users = (await collections.users?.find({}).toArray()) as User[];

        const sensorQuery = {eventId: id.toString()};
        const sensors = (await collections.sensors?.find(sensorQuery).toArray()) as Sensor[];
        const spots = (await collections.spots?.find(sensorQuery).sort('order').toArray()) as Spot[];
        const races = (await collections.races?.find(sensorQuery).toArray()) as Race[];

        res.status(200)
        res.render('event.ejs', {event, sensors, spots, users, races});
    
    } catch (e) {
        res.status(300).json({error:e})
    }
})

eventRouter.get("/:id/race/:raceId", async function(req:Request, res:Response, next){
    try {
        const id:ObjectId = new ObjectId(req?.params?.id);
        const query = {_id: id };
        const event = (await collections.events?.findOne(query)) as RaceEvent;
        if (!event) {
            res.status(404).send('not found');
            return;
        }
        const raceId:ObjectId = new ObjectId(req?.params?.raceId);
        const raceQuery = {_id : raceId};
        const race = (await collections.races?.findOne(raceQuery)) as Race;
        if (!race) {
            res.status(404).send('not found');
            return;
        }

        const raceRTQuery = {raceId: raceId.toString()};
        const raceRoutePoints = (await collections.raceRoutePoints?.find(raceRTQuery).sort('order').toArray()) as RaceRoutePoint[];
        const raceParticipants = (await collections.raceParticipants?.find(raceRTQuery).toArray()) as RaceParticipant[];

        const raceRoutePointsById = new Map<string, RaceRoutePoint>();
        raceRoutePoints.forEach((val) => {
            if (!val._id) {
                return;
            }
            raceRoutePointsById.set(val._id.toString(), val);
        })

        const users = (await collections.users?.find({}).toArray()) as User[];
        const usersById = new Map<string, User>();
        users.forEach((user:User) => {
            if (!user._id) {
                return;
            }
            usersById.set(user._id.toString(), user);
        })

        const raceParicipantUsers = new Array<User>();
        raceParticipants.forEach((raceParticipant) => {
            const user = usersById.get(raceParticipant.userId);
            if (user) {
                raceParicipantUsers.push(user);
            }
        })

        const sensorQuery = {eventId: id.toString()};
        const sensors = (await collections.sensors?.find(sensorQuery).toArray()) as Sensor[];
        const spots = (await collections.spots?.find(sensorQuery).sort('order').toArray()) as Spot[];
        const spotsById = new Map<string, Spot>();
        spots.forEach((spot:Spot) => {
            if (!spot._id) {
                return;
            }
            spotsById.set(spot._id?.toString(), spot);
        })
        const sensorsById = new Map<string, Sensor>();
        sensors.forEach((sensor) => {
            if (!sensor._id) {
                return;
            }
            sensorsById.set(sensor._id.toString(), sensor);
        })

        const raceLaps = (await collections.raceLaps?.find(raceRTQuery).sort('timestamp').toArray()) as RaceLap[];


        res.status(200)
        res.render('race.ejs', {event, race, raceRoutePoints, raceParicipantUsers, spotsById, spots, sensors, sensorsById, 
            users, usersById, raceLaps, raceRoutePointsById});
    
    } catch (e) {
        res.status(300).json({error:e})
    }
})
