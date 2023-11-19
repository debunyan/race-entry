import express, { Request, Response } from "express";
import * as mongoDB from "mongodb";
import RaceEvent from "../models/race-event";
import Spot from "../models/spot";
import {collections} from "../services/database.service";
export const spotApiRouter = express.Router();

spotApiRouter.use(express.json());


spotApiRouter.get("/", async function(req:Request, res:Response, next){
    try {
        const spots = (await collections.spots?.find({}).toArray()) as Spot[];
        res.status(200).json(spots);
    } catch (e) {
        res.status(300).json({error:e})
    }
})

spotApiRouter.post("/", async function(req:Request, res:Response, next){
    try {
        const newSpot = req.body as Spot;
        newSpot.created = new Date().toISOString();
        newSpot.modified = null;
        const result = await collections.spots?.insertOne(newSpot);

        result
            ? res.status(201).json({'id': (await result).insertedId})
            : res.status(500).json({'message':"failed"});
    } catch (e) {
        res.status(400).json({error:e})
    }
})

spotApiRouter.get("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const event = (await collections.spots?.findOne(query)) as Spot;
        if (event) {
            res.status(200).json(event);
        } else {
            console.log('error ? ')
        }
    } catch (e) {
        res.status(300).json({error:e})
    }
})

spotApiRouter.put("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        // _id が残っていると MongoDB はアップデートしてくれない
        const updatedEvent = req.body as Spot;
        delete updatedEvent._id;
        updatedEvent.modified = new Date().toISOString();

        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.spots?.replaceOne(query, updatedEvent);

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

spotApiRouter.delete("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.spots?.deleteOne(query);

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