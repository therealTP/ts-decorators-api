// Configure app environment variables
import * as dotenv from 'dotenv';
dotenv.config();

import { $log } from "ts-log-debug";
import { Server } from "./Server";
import { db } from './services/db';

$log.info('Initialize server');

// Create Server Instance:
const server = new Server();

// Start server
server.start().then(() => {
    $log.info('Server started...');
    // Connect to DB, non-blocking
    if (process.env.ENV !== 'TEST') db.connect();
})
.catch((err) => {
    $log.error(err);
});

// export express app for testing
export const app = server.expressApp;