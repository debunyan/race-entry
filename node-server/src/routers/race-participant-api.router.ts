import express, { Request, Response } from "express";
import * as mongoDB from "mongodb";
import RaceParticipant from "../models/race-participant";
import {collections} from "../services/database.service";

export const raceParticipantApiRouter = express.Router();

raceParticipantApiRouter.use(express.json());



raceParticipantApiRouter.get("/", async function(req:Request, res:Response, next){
    try {
        const raceParticipants = (await collections.raceParticipants?.find({}).toArray()) as RaceParticipant[];
        res.status(200).json(raceParticipants);
    } catch (e) {
        res.status(300).json({error:e})
    }
})

raceParticipantApiRouter.post("/", async function(req:Request, res:Response, next){
    try {
        const newRaceParticipant = req.body as RaceParticipant;
        newRaceParticipant.created = new Date().toISOString();
        newRaceParticipant.modified = null;
        const result = await collections.raceParticipants?.insertOne(newRaceParticipant);

        result
            ? res.status(201).json({'id': (await result).insertedId})
            : res.status(500).json({'message':"failed"});
    } catch (e) {
        res.status(400).json({error:e})
    }
})

raceParticipantApiRouter.get("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const event = (await collections.raceParticipants?.findOne(query)) as RaceParticipant;
        if (event) {
            res.status(200).json(event);
        } else {
            console.log('error ? ')
        }
    } catch (e) {
        res.status(300).json({error:e})
    }
})

raceParticipantApiRouter.put("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        // _id が残っていると MongoDB はアップデートしてくれない
        const updatedEvent = req.body as RaceParticipant;
        delete updatedEvent._id;
        updatedEvent.modified = new Date().toISOString();

        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.raceParticipants?.replaceOne(query, updatedEvent);

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

raceParticipantApiRouter.delete("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.raceParticipants?.deleteOne(query);

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