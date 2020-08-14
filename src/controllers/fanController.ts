import {ClimateService} from "../services/climateService";
import ConfigStore from 'configstore';
import {Express} from "express";

export function FanController(app: Express, config: ConfigStore, climate: ClimateService) {
    const ENDPOINT = '/fan'

    app.get(ENDPOINT, get)
    app.post(ENDPOINT, post);
    app.put(ENDPOINT, put);

    let onCron, offCron;

    function cron() {
        if(config.get('climate.autoFan')) {
            if (onCron != null) {
                onCron.stop();
                onCron = null;
            }
        } else if (onCron != null || offCron != null) {
            onCron.stop();
            onCron = null;
            offCron.stop();
            offCron = null;
        }
    }

    function get(req, res) {
        let resp = {
            on: climate.fanState(),
            autoFan: config.get('climate.autoFan'),
            fanMode: config.get('climate.fanMode'),
            fanOn: config.get('climate.fanOn'),
            fanOff: config.get('climate.fanOff'),
            fanTemp: config.get('climate.fanTemp'),
            fanHumidity: config.get('climate.fanHumidity'),
        };
        res.json(resp);
    }

    function post(req, res) {
        console.log('Toggling fan');
        climate.toggleFan();
        get(req, res);
    }

    function put(req, res) {
        console.log('Updating fan config');
        console.log(req.body);
        if(req.body['autoFan'] != null) config.set('climate.autoFan', req.body['autoFan']);
        if(req.body['fanMode'] != null) config.set('climate.fanMode', req.body['fanMode']);
        if(req.body['fanOn'] != null) config.set('climate.fanOn', req.body['fanOn']);
        if(req.body['fanOff'] != null) config.set('climate.fanOff', req.body['fanOff']);
        if(req.body['fanTemp'] != null) config.set('climate.fanTemp', req.body['fanTemp']);
        if(req.body['fanHumidity'] != null) config.set('climate.fanHumidity', req.body['fanHumidity']);
        cron();
        get(req, res)
    }

    cron();
}
