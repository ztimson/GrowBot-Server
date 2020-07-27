import cv from 'opencv4nodejs';
import {Image} from "../models/image";

export class CameraService {
    private capture;

    constructor(private resolution: [number, number] = [1920, 1080]) {
        this.capture = new cv.VideoCapture(0);
        this.capture.set(cv.CAP_PROP_FRAME_HEIGHT, this.resolution[0]/1); // hack to turn int into double
        this.capture.set(cv.CAP_PROP_FRAME_WIDTH, this.resolution[1]/1);
    }

    snap() {
        let frame = this.capture.read();
        return cv.imencode('.jpg', frame).toString('base64');
    }
}
