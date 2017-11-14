import { PgDb, PgSchema, PgTable, QueryOptions } from 'pogi';
import { handleDbConnectionError } from './errors';

const dbConfig = {
    host: process.env.DB_URL,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    max: 10,
    idleTimeoutMillis: 10000, // close idle clients after 10s
    poolSize: 10
};

const testDbConfig = {
    host: process.env.TEST_DB_URL,
    port: process.env.TEST_DB_PORT,
    database: process.env.TEST_DB_NAME,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PW,
    max: 10,
    idleTimeoutMillis: 10000, // close idle clients after 10s
    poolSize: 10
};

class Db {
    pgdb: PgDb;
    connected: boolean;
    connecting: boolean;

    constructor() {
        this.connected = false;
    }

    public async connect() {
        if (!this.connected && !this.connecting) {
            this.connecting = true;
            try {
                let config;
                if (process.env.ENV === 'TEST') {
                    config = testDbConfig;
                } else {
                    config = dbConfig;
                }
                this.pgdb = await PgDb.connect(config);
                this.connected = true;
                console.log("DB Connected");
            } catch(err) {
                handleDbConnectionError(err);
            } finally {
                this.connecting = false;
            }
        } else {
            console.log("DB already connected");
        }

    }

    public getTable(tableName: string) {
        if (this.connected) {
            return this.pgdb['tables'][tableName];
        } else {
            return null;
        }
    }

    public query(queryString: string, params: {}, options?: QueryOptions) {
        return this.pgdb.query(queryString, params, options);
    }
}

export let db = new Db();