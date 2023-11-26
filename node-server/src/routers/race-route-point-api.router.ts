import express, { Request, Response } from "express";
import * as mongoDB from "mongodb";
import RaceRoutePoint from "../models/race-route-point";
import {collections} from "../services/database.service";

export const raceRoutePointApiRouter = express.Router();

raceRoutePointApiRouter.use(express.json());



raceRoutePointApiRouter.get("/", async function(req:Request, res:Response, next){
    try {
        const raceRoutePoints = (await collections.raceRoutePoints?.find({}).toArray()) as RaceRoutePoint[];
        res.status(200).json(raceRoutePoints);
    } catch (e) {
        res.status(300).json({error:e})
    }
})

raceRoutePointApiRouter.post("/", async function(req:Request, res:Response, next){
    try {
        const newRaceRoutePoint = req.body as RaceRoutePoint;
        newRaceRoutePoint.created = new Date().toISOString();
        newRaceRoutePoint.modified = null;
        const result = await collections.raceRoutePoints?.insertOne(newRaceRoutePoint);

        result
            ? res.status(201).json({'id': (await result).insertedId})
            : res.status(500).json({'message':"failed"});
    } catch (e) {
        res.status(400).json({error:e})
    }
})

raceRoutePointApiRouter.get("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const event = (await collections.raceRoutePoints?.findOne(query)) as RaceRoutePoint;
        if (event) {
            res.status(200).json(event);
        } else {
            console.log('error ? ')
        }
    } catch (e) {
        res.status(300).json({error:e})
    }
})

raceRoutePointApiRouter.put("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        // _id が残っていると MongoDB はアップデートしてくれない
        const updatedEvent = req.body as RaceRoutePoint;
        delete updatedEvent._id;
        updatedEvent.modified = new Date().toISOString();

        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.raceRoutePoints?.replaceOne(query, updatedEvent);

        result
            ? res.status(201).json({'id': id})
            : res.status(500).json({'message':"failed"});
    } catch (e) {
        console.error('update error', e);
        console.error(id, req.body)
        console.error('query',  {_id: new mongoDB.ObjectId(id) })
        res.status(300).json({error:e})
    }
})

raceRoutePointApiRouter.delete("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.raceRoutePoints?.deleteOne(query);

        if (result && (await result).deletedCount) {
            res.status(202).json({'id': id})
        } else if (!result) {
            res.status(400).json({'id': id})
        } else if (!(await result).deletedCount) {
            res.status(404).json({'id': id})
        }
    } catch (e) {
        res.status(300).json({error:e})
    }
})