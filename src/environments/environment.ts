export const environment = {
    cors: 'http://localhost:4200',
    imageDir: __dirname + '/../images',
    port: 5000,
    defaultConfig: {
        camera: {
            timelapseEnabled: true,
            timelapseFrequency: '0 0 12 * * *' // '0 0 12 * * *'
        },
        climate: {
            autoFan: false,
            fanMode: 'time',
            fanOn: null,
            fanOff: null,
            fanTemp: null,
            fanHumidity: null,
            autoLight: false,
            lightOn: null,
            lightOff: null,
            logRate: '1m',
        }
    }
}
