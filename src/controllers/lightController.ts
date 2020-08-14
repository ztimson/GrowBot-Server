import {ClimateService} from "../services/climateService";
import ConfigStore from 'configstore';
import {Express} from "express";

export function LightController(app: Express, config: ConfigStore, climate: ClimateService) {
    const ENDPOINT = '/light'

    app.get(ENDPOINT, get)
    app.post(ENDPOINT, post);
    app.put(ENDPOINT, put);

    function get(req, res) {
        let resp = {
            on: climate.lightState(),
            autoLight: config.get('climate.autoLight'),
            lightOn: config.get('climate.lightOn'),
            lightOff: config.get('climate.lightOff')
        };
        res.json(resp);
    }

    function post(req, res) {
        console.log('Toggling light');
        climate.toggleLight();
        get(req, res);
    }

    function put(req, res) {
        console.log('Updating light config');
        console.log(req.body);
        if(req.body['autoLight'] != null) config.set('climate.autoLight', req.body['autoLight']);
        if(req.body['lightOn'] != null) config.set('climate.lightOn', req.body['lightOn']);
        if(req.body['lightOff'] != null) config.set('climate.lightOff', req.body['lightOff']);
        get(req, res)
    }
}
