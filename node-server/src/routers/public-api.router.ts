import express, { Request, Response } from "express";
import * as mongoDB from "mongodb";
import Race from "../models/race";
import Spot from "../models/spot";
import Sensor from "../models/sensor";
import type {GPSCoordinates} from "../models/spot"
import {collections} from "../services/database.service";
import RaceLap from "../models/race-lap";
import RaceRoutePoint from "../models/race-route-point";

export const publicApiRouter = express.Router();

/**
 * 外部に公開するAPI
 */
publicApiRouter.use(express.json());



publicApiRouter.post("/spot-setup", async function(req:Request, res:Response, next){
    try {
        if (!Object.keys(req.body).includes("device-id") || typeof req.body['device-id'] !== 'string' || 
        !Object.keys(req.body).includes("time-stamp") || typeof req.body['time-stamp'] !== 'string' || 
        !Object.keys(req.body).includes("location") || !Array.isArray(req.body['location'])) {
            throw new Error("invalid parameter");
        }
        const sensorId = req.body['device-id'] as string;
        const timeStamp = new Date(req.body['time-stamp']);
        const location = req.body['location'] as number[];
        const gpsCoordinate:GPSCoordinates = {
            latitude : location[0],
            longitude : location[1],
            altitude : location[2]
        };

        const sensorQuery = {_id: new mongoDB.UUID(sensorId) };
        const sensor = (await collections.sensors?.findOne(sensorQuery)) as Sensor;
        const spotQuery = {sensorId};
        const spots = (await collections.spots?.find(spotQuery).toArray()) as Spot[];        

        //todo センサータイプなど操作対象のチェック
        spots.forEach((spot) => {
            const spotQuery = {_id: new mongoDB.ObjectId(spot._id)};
            const updatedSpot =  {...spot};
            delete updatedSpot._id;
            updatedSpot.gpsCoordinates = gpsCoordinate;

            collections.spots?.replaceOne(spotQuery, updatedSpot);
        })

        res.status(200).json({'message':'device located. affected spots:' + spots.length})
    } catch (e) {
        res.status(400).json({error:e})
    }
})

publicApiRouter.post("/spot-checkin", async function(req:Request, res:Response, next){
    try {
        if (!Object.keys(req.body).includes("device-id") || typeof req.body['device-id'] !== 'string' || 
        !Object.keys(req.body).includes("time-stamp") || typeof req.body['time-stamp'] !== 'string' || 
        !Object.keys(req.body).includes("user-id") || typeof req.body['user-id'] !== 'string') {
            console.log('aa')
            throw new Error("invalid parameter");
        }

        const sensorId = req.body['device-id'] as string;
        const timeStamp = new Date(req.body['time-stamp']);
        const userId = req.body['user-id'] as string;

        const spotAndRoutePoints = (await collections.spots?.aggregate([
            { $lookup:
                {
                    from: 'raceParticipants',
                    localField: 'eventId',
                    foreignField: 'eventId',
                    as : 'raceParticipants',
                    pipeline : [
                        { $match: 
                            {
                                userId
                            }
                        }
                    ]
                },
            },
            { $match:
                {
                    sensorId,
                }
            },
        ]).toArray())

        const candidateSpotIds = new Array<string>();
        spotAndRoutePoints?.forEach((val) => {
            if (!val.raceParticipants || !val.raceParticipants.length) {
                return;
            }
            candidateSpotIds.push(val._id.toString());
        })

        const checkinRoutePoints = (await collections.raceRoutePoints?.aggregate([
            { $match: 
                {
                    spotId: { $in:candidateSpotIds }
                }
            },
        ]).toArray()) as RaceRoutePoint[];

        const insertLaps = new Array<RaceLap>();
        checkinRoutePoints?.forEach((routePoint) => {
            if (!routePoint._id) {
                return;
            }
            const lap:RaceLap = {
                raceId: routePoint.raceId,
                userId,
                timestamp: timeStamp.toISOString(),
                routePointId: routePoint._id?.toString(),
                data: ''
            }
            insertLaps.push(lap)
        })

        const result = await collections.raceLaps?.insertMany(insertLaps);
        result
            ? res.status(201).json({'id': (await result).insertedIds})
            : res.status(500).json({'message':"failed"});
    } catch (e) {
        console.log(e);
        res.status(400).json({error:e})
    }
})
