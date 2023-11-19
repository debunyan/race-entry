import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import * as mongoDB from "mongodb";
import File from "../models/file";
import {collections} from "../services/database.service";
import * as fs from "fs"
import path from "path";
import dotenv from "dotenv";
export const fileRouter = express.Router();
const storeBaseDir = '/uploads';

dotenv.config();


fileRouter.get("/:name", async function(req:Request, res:Response, next){
    const name = req?.params?.name;
    try {
        const query = {accessUrl: process.env.BASEURL + storeBaseDir + '/' + encodeURIComponent(name) };
        const file = (await collections.files?.findOne(query)) as File;
        if (file && file._id) {
            const storePath = path.resolve(storeBaseDir, file._id.toString());
            res.contentType(file.mimeType);
            res.status(200).sendFile(storePath);
        } else {
            res.status(404).send('not found');
        }
    } catch (e) {
        res.status(300).json({error:e})
    }
})
