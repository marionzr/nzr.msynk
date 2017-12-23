import { Request, Response, RequestHandler } from 'express';
import AbstractTestingRoute from '../AbstractTestingRoute';

class OopsRoute extends AbstractTestingRoute {
    public static readonly PATH: string = '/error/oops';
    constructor() {
        super(OopsRoute.PATH);
    }

    public routeGet(): RequestHandler {
        let handler =  (req : Request, res : Response) : void => {
            res.emit('error', new Error('oops!'));
        };

        return handler;
    }
}

export default OopsRoute;