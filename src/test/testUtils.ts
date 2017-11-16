import * as Chai from "chai";
import * as ChaiAsPromised from "chai-as-promised";
import * as SinonLib from "sinon";
import * as SinonChai from "sinon-chai";
import chaiHttp = require('chai-http');

import { ExpressApplication } from "ts-express-decorators";
import { $log } from "ts-log-debug";
import { Done, bootstrap, inject } from "ts-express-decorators/testing";

// Configure app environment variables
import * as dotenv from 'dotenv';
dotenv.config();

Chai.should();
Chai.use(chaiHttp);
Chai.use(SinonChai);
Chai.use(ChaiAsPromised);

const expect = Chai.expect;
const assert = Chai.assert;
const request = Chai.request;
const Sinon = SinonLib;

const $logStub = {
    $log: $log as any
};

Sinon.stub($log, "info");
Sinon.stub($log, "debug");
Sinon.stub($log, "error");
Sinon.stub($log, "warn");

export {
    expect,
    assert,
    request,
    Sinon,
    SinonChai,
    $logStub,
    Done,
    bootstrap,
    inject,
    ExpressApplication
};