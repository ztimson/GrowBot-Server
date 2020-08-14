export class ClimateService {
    private readonly interval = 3 // Seconds

    private fanStatus = false;
    private lightStatus = false;
    private temp = [25.0];
    private humidity = [0.65];

    constructor() {
        setInterval(() => {
            let up = Math.random() > 0.5,
                lastTemp = this.temp[this.temp.length - 1],
                lastHumid = this.humidity[this.humidity.length - 1];
            this.temp.push(lastTemp + (up ? 1 : -1) * Math.random())
            this.humidity.push(lastHumid + (up ? 1 : -1) * Math.random())
        }, this.interval * 1000)
    }

    public fanState() {
        return this.fanStatus;
    }

    public lightState() {
        return this.lightStatus;
    }

    public getHumidity() {
        return this.humidity;
    }

    public getTemp() {
        return this.temp;
    }

    public toggleFan() {
        this.fanStatus = !this.fanStatus;
        return this.fanState();
    }

    public toggleLight() {
        this.lightStatus = !this.lightStatus;
        return this.lightState();
    }
}
