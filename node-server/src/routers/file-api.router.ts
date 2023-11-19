import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import * as mongoDB from "mongodb";
import File from "../models/file";
import {collections} from "../services/database.service";
import * as fs from "fs"
import path from "path";
import dotenv from "dotenv";
export const fileApiRouter = express.Router();
const storeBaseDir = '/uploads';

dotenv.config();

fileApiRouter.use(express.json());

// 文字コードを指定しないとファイル名が化ける
fileApiRouter.use(fileUpload({
    uriDecodeFileNames: true,
    defCharset: 'utf8',
    defParamCharset: 'utf8'
}));


fileApiRouter.get("/", async function(req:Request, res:Response, next){
    try {
        const files = (await collections.files?.find({}).toArray()) as File[];
        res.status(200).json(files);
    } catch (e) {
        res.status(300).json({error:e})
    }
})

fileApiRouter.post("/", async function(req:Request, res:Response, next){
    try {
        const newFile = req.body as File;
        if (!req.files || !req.files.file) {
            throw new Error('file was not uploaded');
        }
        const file = req.files.file;
        console.log(file);
        if (file && !Array.isArray(file) ) {
            newFile.fileName = file.name;
            newFile.size = file.size;
            newFile.mimeType = file.mimetype;
            newFile.accessUrl = new URL(process.env.BASEURL + '/uploads/' + encodeURIComponent(newFile.fileName)).toString();
            newFile.created = new Date().toISOString()
            newFile.modified = new Date().toISOString()

            const query = {accessUrl: process.env.BASEURL + storeBaseDir + '/' + encodeURIComponent(newFile.fileName) };
            const fileAlreadyUploaded = (await collections.files?.findOne(query)) as File;
            if (fileAlreadyUploaded) {
                res.status(200).json(fileAlreadyUploaded)
                console.log('file already uploaded')
                return;
            }


            const result = await collections.files?.insertOne(newFile);
            if (result) {
                const newFileId = (await result).insertedId;
                console.log(newFileId);
                const storePath = path.resolve(storeBaseDir, newFileId.toString());
                console.log(storePath);
                fs.writeFileSync(storePath, file.data);
                newFile._id = newFileId;
                res.status(201).json(newFile)
            } else {
                res.status(500).json({'message':"failed"});
            }
        } else {
            res.status(500).json({'message':"failed"});
        }
    } catch (e) {
        res.status(400).json({error:e})
    }
})

fileApiRouter.get("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const file = (await collections.files?.findOne(query)) as File;
        if (file) {
            res.status(200).json(file);
        } else {
            console.log('error ? ')
        }
    } catch (e) {
        res.status(300).json({error:e})
    }
})

fileApiRouter.put("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        // _id が残っていると MongoDB はアップデートしてくれない
        const updatedFile = req.body as File;
        delete updatedFile._id;

        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.files?.replaceOne(query, updatedFile);

        result
            ? res.status(201).json({'message': 'updated', 'id': id})
            : res.status(500).json({'message':"failed"});
    } catch (e) {
        console.error('update error', e);
        console.error(id, req.body)
        console.error('query',  {_id: new mongoDB.ObjectId(id) })
        res.status(300).json({error:e})
    }
})

fileApiRouter.delete("/:id", async function(req:Request, res:Response, next){
    const id = req?.params?.id;
    try {
        const query = {_id: new mongoDB.ObjectId(id) };
        const result = await collections.files?.deleteOne(query);

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