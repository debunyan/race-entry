import express, { Request, Response } from "express";
import dotenv from "dotenv";
import {connectToDatabase} from "./services/database.service";
import RaceEvent from "./models/race-event"
import User from "./models/user"
import {collections} from "./services/database.service";

import {eventApiRouter} from "./routers/event-api.router";
import {eventRouter} from "./routers/event.router";
import {fileApiRouter} from "./routers/file-api.router";
import {fileRouter} from "./routers/file.router";
import { sensorApiRouter } from "./routers/sonsor-api.router";
import { spotApiRouter } from "./routers/spot-api.router";
import { userApiRouter } from "./routers/user-api.router";
import { raceApiRouter } from "./routers/race-api.router";
import { raceRoutePointApiRouter } from "./routers/race-route-point-api.router";
import { raceParticipantApiRouter } from "./routers/race-participant-api.router";

import { publicApiRouter } from "./routers/public-api.router";

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.set("views", "/app/src/views"); // ejs は TypeScript によってコンパイルされない

// Origin 制約を解除しないとブラウザから直接API呼び出しできない。
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', "true");
    next();
});

app.use('/uploads', fileRouter)
app.use("/api/file", fileApiRouter);

const port = process.env.PORT;

const topPageRouter = express.Router();

topPageRouter.get('/', async function(req:Request, res:Response, next){
    try {
        const events = (await collections.events?.find({}).toArray()) as RaceEvent[];
        const users = (await collections.users?.find({}).toArray()) as User[];
        res.status(200)
        res.render('index.ejs', {events, users});
    } catch (e) {
        res.status(300).json({error:e})
    }
});

connectToDatabase()
    .then(() => {
        app.use("/", topPageRouter);
        app.use("/event", eventRouter);
        
        app.use("/api/event", eventApiRouter);
        app.use("/api/sensor", sensorApiRouter);
        app.use("/api/spot", spotApiRouter);

        app.use("/api/user", userApiRouter);
        app.use("/api/race", raceApiRouter);
        app.use("/api/race-route-point", raceRoutePointApiRouter);
        app.use("/api/race-participant", raceParticipantApiRouter);

        app.use("/papi/", publicApiRouter);

        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    })
    .catch((error:Error) => {
        console.error("Database connection failed", error);
        process.exit();
    })


