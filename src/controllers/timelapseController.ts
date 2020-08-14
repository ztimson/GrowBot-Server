import express, {Express} from 'express';
import ConfigStore from 'configstore';
import fs from 'fs';
import {environment} from "../environments/environment";
import {CameraService} from "../services/cameraService";
import {CronJob} from 'cron';

export function TimelapseController(app: Express, config: ConfigStore, camera: CameraService) {
    const SAVE_DIR = environment.imageDir;
    const ENDPOINT = '/timelapse'

    app.use('/images', express.static(SAVE_DIR))
    app.delete(ENDPOINT + '/:filename', del);
    app.get(ENDPOINT, get)
    app.post(ENDPOINT, post);
    app.put(ENDPOINT, put);

    let timelapseCron: CronJob;

    function cron() {
        if(config.get('camera.timelapseEnabled') == true) {
            if(timelapseCron != null) {
                timelapseCron.stop();
                timelapseCron = null;
            }

            timelapseCron = new CronJob(config.get('camera.timelapseFrequency'), () => {
                console.log('Snapping timelapse picture')
                let date = new Date();
                let image = camera.snap();
                let filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.jpg`;
                fs.writeFileSync(`${SAVE_DIR}/${filename}`, image, 'base64');
            });
            timelapseCron.start();
        } else if(timelapseCron != null) {
            timelapseCron.stop();
            timelapseCron = null;
        }
    }

    function del(req, res) {
        let filename = req.params.filename;
        console.log(`Deleting ${filename}`);
        fs.unlinkSync(`${SAVE_DIR}/${filename}`);
        get(req, res);
    }

    function get(req, res) {
        let resp = {
            timelapseEnabled: config.get('camera.timelapseEnabled'),
            timelapseFrequency: config.get('camera.timelapseFrequency'),
            files: fs.readdirSync(SAVE_DIR)
        };
        res.json(resp);
    }

    function post(req, res) {
        console.log('Snapping picture')
        let date = new Date();
        let image = camera.snap();
        let filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.jpg`;
        fs.writeFileSync(`${SAVE_DIR}/${filename}`, image, 'base64');
        get(req, res);
    }

    function put(req, res) {
        console.log('Updating timelapse');
        console.log(req.body);
        if(req.body['timelapseEnabled'] != null) config.set('camera.timelapseEnabled', req.body['timelapseEnabled']);
        if(req.body['timelapseFrequency'] != null) config.set('camera.timelapseFrequency', req.body['timelapseFrequency']);
        cron();
        get(req, res);
    }

    if(!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR);
    cron();
}
