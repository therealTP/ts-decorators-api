import { 
    Response,
    ResponseData, 
    Endpoint,
    EndpointInfo,  
    IMiddleware, 
    Middleware
} from "ts-express-decorators";
import { Unauthorized } from "ts-httpexceptions";
import { Response as ExpressResponse} from 'express';

@Middleware()
export class RemoveResponsePasswordMw implements IMiddleware {
    /**
     *
     * @param data
     * @param endpoint
     * @param reponse
     */
    use(
        @ResponseData() data: any,
        @EndpointInfo() endpoint: Endpoint,    
        @Response() response: ExpressResponse
    ) {
        // if data is on response object, delete it:
        if (data.response.password) {
            delete data.response.password;
            return data;
        } 
        
        // otherwise, loop through props, find all arrs, & del from arrs
        else {
            for (var key in data.response) {
                var val = data.response[key];
                if (Array.isArray(val)) {
                    for (var i = 0; i < val.length; i++) {
                        delete data.response[key][i].password;
                    }
                }
            }
        }
    };
}