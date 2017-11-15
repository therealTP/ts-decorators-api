// Configure app environment variables
import * as dotenv from 'dotenv';
dotenv.config();

import { $log } from "ts-log-debug";
import { Server } from "./Server";
import { db } from './services/db';

$log.info('Initialize server');

export const server = new Server().start().then(() => {
    $log.info('Server started...');
    // Connect to DB, non-blocking
    if (process.env.ENV !== 'TEST') db.connect();
})
.catch((err) => {
    $log.error(err);
});