import { createClient, LogglyInstance, LogglyOptions } from 'loggly';

class Logger {
    private client: LogglyInstance;

    constructor() {
        const clientOptions: LogglyOptions = {
            token: process.env.LOGGLY_TOKEN,
            subdomain: process.env.LOGGLY_SUBDOMAIN,
            tags: [process.env.LOGGLY_TAG],
            json: true
        };
        this.client = createClient(clientOptions);
    }

    public log(logObject: {}) {
        this.client.log(logObject, (err, result) => {
            if (err) console.log("LOG ERROR", JSON.stringify(err));
        });
    }
}

export let logger = new Logger();