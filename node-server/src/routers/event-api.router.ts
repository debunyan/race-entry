import express, { Request, Response } from "express";
import * as mongoDB from "mongodb";
import RaceEvent from "../models/race-event";
import {collections} from "../services/database.service";
export const eventApiRouter = express.Router();

eventApiRouter.use(express.json());



eventApiRouter.get("/", async function(req:Request, res:Response, next){
    try {
        const events = (await collections.events?.find({}).toArray()) as RaceEvent[];
        res.status(200).json(events);
    } catch (e) {
        res.status(300).json({error:e})
    }
})

eventApiRouter.post("/", async function(req:Request, res:Response, next){
    try {
        const newEvent = req.body as RaceEvent;
        newEvent.created = new Date().toISOString();
        newEvent.modified = null;
        const result = await collections.events?.insertOne(newEvent);

        result
            ? res.status(201).json({'id': (await result).insertedId})
            : res.status(500).json({'message':"failed"});
    } catch (e) {
        res.status(400).json({error:e})
    }
})

eventApiRouter.get("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const event = (await collections.events?.findOne(query)) as RaceEvent;
        if (event) {
            res.status(200).json(event);
        } else {
            console.log('error ? ')
        }
    } catch (e) {
        res.status(300).json({error:e})
    }
})

eventApiRouter.put("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        // _id が残っていると MongoDB はアップデートしてくれない
        const updatedEvent = req.body as RaceEvent;
        delete updatedEvent._id;
        updatedEvent.modified = new Date().toISOString();

        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.events?.replaceOne(query, updatedEvent);

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

eventApiRouter.delete("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.events?.deleteOne(query);

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