import * as Express from "express";
import {$log} from "ts-log-debug";
import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from "ts-express-decorators";
import Path = require("path");
// import "ts-express-decorators/ajv"; // import ajv ts.ed module

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    rootDir,
    acceptMimes: ["application/json"],
    mount: {
        "/rest": `${rootDir}/controllers/**/*.js`,
    },
    componentsScan: [
        `${rootDir}/services/**/**.js`,
        `${rootDir}/models/**/**.js`
    ]
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void | Promise<any> {
    
        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');
            
        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    public $onReady(){
        $log.debug('Server initialized');
    }
   
    public $onServerInitError(err){
        $log.error('Server encounter an error =>', err);
    }    
}