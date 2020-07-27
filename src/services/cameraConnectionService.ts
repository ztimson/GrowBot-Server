import {CameraService} from "./cameraService";

export class CameraConnectionService {
    private readonly FPS = 4;

    private broadcast;

    constructor(private socket, private camera: CameraService) {
        this.socket.on('connection', (s) => {
            let address = s.request.connection.remoteAddress;
            console.log(`Client Connecting: ${address}`)
        })
        this.beginBroadcast();
    }

    beginBroadcast() {
        this.broadcast = setInterval(() => {
            let frame = this.camera.snap();
            this.socket.emit('stream', frame);
        }, 1000 / this.FPS);
    }
}
