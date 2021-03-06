import express = require("express");
import Base64 from "./base64";
import Sqlite from "better-sqlite3";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
const dev = process.env.NODE_ENV === "development";
const db = new Sqlite("./database.db", {
    verbose: dev ? console.log : undefined
});
const app = express();
const upload = multer({
    storage: multer.memoryStorage()
});

function reset() {
    fs.unlinkSync(path.join(__dirname, dev ? "uploads/*.*" : "../uploads/*.*"));
    return db.prepare("DELETE FROM counter; DELETE FROM sqlite_sequence WHERE name='counter'").run();
}

function getID(base64: boolean = true) {
    const ID = db.prepare("INSERT INTO counter (a) VALUES (0)").run().lastInsertRowid as number;
    if(base64) return Base64.fromNumber(ID);
    else return ID;
}

app.use(express.static("uploads"));

app.post("/upload", upload.single("file"), (req, res) => {
    if(!req.headers.authorization) return res.status(401).end();
    if(req.headers.authorization !== process.env.AUTHORIZATION) return res.status(403).end();
    const ID = String(getID());
    fs.writeFile(path.join(__dirname, dev ? "uploads/" : "../uploads/", `${ID}${path.extname(req.file.originalname)}`), req.file.buffer as Buffer, (err) => {
        if(err) return res.status(500).end();
        res.status(201).json({
            URL: `https://drive.neoney.xyz/${ID}${path.extname(req.file.originalname)}`,
            // deletionURL: `https://drive.neoney.xyz/delete/${ID}`
        });
    });
});

// NOT A CORRECT IMPLEMENTATION FOR ShareX!

// app.post("/delete/:id", (req, res) => {
//     if(!req.headers.authorization) return res.status(401).end();
//     if(req.headers.authorization !== process.env.AUTHORIZATION) return res.status(403).end();
//     const ID = req.params.id;
//     fs.unlinkSync(path.join(__dirname, "uploads/", `${ID}.*`));
//     res.status(200).end();
// });

app.post("/reset", (req, res) => {
    if(!req.headers.authorization) return res.status(401).end();
    if(req.headers.authorization !== process.env.AUTHORIZATION) return res.status(403).end();
    reset();
    res.status(200).end();
});

app.listen(3000);
