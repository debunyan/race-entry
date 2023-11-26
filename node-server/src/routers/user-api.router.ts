import express, { Request, Response } from "express";
import * as mongoDB from "mongodb";
import User from "../models/user";
import {collections} from "../services/database.service";

export const userApiRouter = express.Router();

userApiRouter.use(express.json());



userApiRouter.get("/", async function(req:Request, res:Response, next){
    try {
        const users = (await collections.users?.find({}).toArray()) as User[];
        res.status(200).json(users);
    } catch (e) {
        res.status(300).json({error:e})
    }
})

userApiRouter.post("/", async function(req:Request, res:Response, next){
    try {
        const newUser = req.body as User;
        newUser.created = new Date().toISOString();
        newUser.modified = null;
        const result = await collections.users?.insertOne(newUser);

        result
            ? res.status(201).json({'id': (await result).insertedId})
            : res.status(500).json({'message':"failed"});
    } catch (e) {
        res.status(400).json({error:e})
    }
})

userApiRouter.get("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const event = (await collections.users?.findOne(query)) as User;
        if (event) {
            res.status(200).json(event);
        } else {
            console.log('error ? ')
        }
    } catch (e) {
        res.status(300).json({error:e})
    }
})

userApiRouter.put("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        // _id が残っていると MongoDB はアップデートしてくれない
        const updatedEvent = req.body as User;
        delete updatedEvent._id;
        updatedEvent.modified = new Date().toISOString();

        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.users?.replaceOne(query, updatedEvent);

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

userApiRouter.delete("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.users?.deleteOne(query);

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