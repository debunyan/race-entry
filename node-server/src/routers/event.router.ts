import express, { Request, Response } from "express";
import {collections} from "../services/database.service";
import RaceEvent from "../models/race-event";
import Sensor from "../models/sensor";
import Spot from "../models/spot";
import { ObjectId } from "mongodb";

export const eventRouter = express.Router();

eventRouter.get("/:id", async function(req:Request, res:Response, next){
    try {
        const id:ObjectId = new ObjectId(req?.params?.id);
        const query = {_id: id };
        const event = (await collections.events?.findOne(query)) as RaceEvent;
        if (!event) {
            res.status(404).send('not found');
        }

        const sensorQuery = {eventId: id.toString()};
        const sensors = (await collections.sensors?.find(sensorQuery).toArray()) as Sensor[]
        const spots = (await collections.spots?.find(sensorQuery).sort('order').toArray()) as Spot[]

        console.log(spots);
        res.status(200)
        res.render('event.ejs', {event, sensors, spots});
    
    } catch (e) {
        res.status(300).json({error:e})
    }
})
