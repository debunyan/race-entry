import express, { Request, Response } from "express";
import * as mongoDB from "mongodb";
import RaceEvent from "../models/race-event";
import Sensor from "../models/sensor";
import {collections} from "../services/database.service";
export const sensorApiRouter = express.Router();

sensorApiRouter.use(express.json());


sensorApiRouter.get("/", async function(req:Request, res:Response, next){
    try {
        const sensors = (await collections.sensors?.find({}).toArray()) as Sensor[];
        res.status(200).json(sensors);
    } catch (e) {
        res.status(300).json({error:e})
    }
})

sensorApiRouter.post("/", async function(req:Request, res:Response, next){
    try {
        const newSensor = req.body as Sensor;
        newSensor.created = new Date().toISOString();
        newSensor.modified = null;
        const result = await collections.sensors?.insertOne(newSensor);

        result
            ? res.status(201).json({'id': (await result).insertedId})
            : res.status(500).json({'message':"failed"});
    } catch (e) {
        res.status(400).json({error:e})
    }
})

sensorApiRouter.get("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.UUID(id) };
        const event = (await collections.sensors?.findOne(query)) as Sensor;
        if (event) {
            res.status(200).json(event);
        } else {
            console.log('error ? ')
        }
    } catch (e) {
        res.status(300).json({error:e})
    }
})

sensorApiRouter.put("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        // _id が残っていると MongoDB はアップデートしてくれない
        const updatedEvent = req.body as Sensor;
        delete updatedEvent._id;
        updatedEvent.modified = new Date().toISOString();

        const query = {_id: new mongoDB.UUID(id) };
        const result = await collections.sensors?.replaceOne(query, updatedEvent);

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

sensorApiRouter.delete("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.UUID(id) };
        const result = await collections.sensors?.deleteOne(query);

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