import ConfigStore from 'configstore';
import express from 'express';
import {environment} from './environments/environment';
import {CameraService} from "./services/cameraService";
import SocketIO from 'socket.io';
import * as http from 'http';
import CORS from 'cors';
import {CameraConnectionService} from "./services/cameraConnectionService";
import {TimelapseController} from "./controllers/timelapseController";

// Setup server
const app = express()
const server = http.createServer(app);
const socket = SocketIO(server);
app.use(CORS({origin: environment.cors, credentials: true}));

// config
const config = new ConfigStore('grow-bot', environment.defaultConfig);

// Setup camera
const camera = new CameraService();
const cameraConnectionService = new CameraConnectionService(socket, camera);

// REST API
TimelapseController(app, camera);

// Start server
server.listen(environment.port, () => console.log(`Starting Server: http://localhost:${environment.port}`));
