import express from 'express';
import fs from 'fs';
import {environment} from "../environments/environment";

export function TimelapseController(app, camera) {
    const SAVE_DIR = environment.imageDir;
    const ENDPOINT = '/timelapse'

    if(!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR);

    app.use('/images', express.static(SAVE_DIR))

    app.get(ENDPOINT, get)
    app.post(ENDPOINT, post);
    app.delete(ENDPOINT + '/:filename', del);

    function del(req, res) {
        let filename = req.params.filename;
        console.log(filename);
        fs.unlinkSync(`${SAVE_DIR}/${filename}`);
        get(req, res);
    }

    function get(req, res) {
        let files = fs.readdirSync(SAVE_DIR);
        res.json(files);
    }

    function post(req, res) {
        let date = new Date();
        let image = camera.snap();
        let filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.jpg`;
        fs.writeFileSync(`${SAVE_DIR}/${filename}`, image, 'base64');
        get(req, res);
    }
}
