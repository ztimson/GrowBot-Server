import ConfigStore from 'configstore';
import express from 'express';
import {environment} from './environments/environment';
import {CameraService} from "./services/cameraService";
import SocketIO from 'socket.io';
import * as http from 'http';
import CORS from 'cors';
import {CameraConnectionService} from "./services/cameraConnectionService";
import {TimelapseController} from "./controllers/timelapseController";
import {ClimateService} from "./services/climateService";
import {FanController} from "./controllers/fanController";
import {LightController} from "./controllers/lightController";

// Configuration
const app = express()
const server = http.createServer(app);
const socket = SocketIO(server);
app.use(express.json());
app.use(CORS({origin: environment.cors, credentials: true}));
const config = new ConfigStore('grow-bot', environment.defaultConfig);
config.set(environment.defaultConfig);

// Services
const camera = new CameraService();
const cameraConnectionService = new CameraConnectionService(socket, camera);
const climateService = new ClimateService();

// Controllers
FanController(app, config, climateService);
LightController(app, config, climateService);
TimelapseController(app, config, camera);

// Start server
server.listen(environment.port, () => console.log(`Starting Server: http://localhost:${environment.port}`));
