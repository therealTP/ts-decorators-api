// Configure app environment variables
import * as dotenv from 'dotenv';
dotenv.config();

import { $log } from "ts-log-debug";
import { Server } from "./Server";
import { db } from './services/db';

$log.info('Initialize server');

// Connect to DB
if (process.env.ENV !== 'TEST') db.connect();

new Server().start().then(() => {
    $log.info('Server started...');
})
.catch((err) => {
    $log.error(err);
});