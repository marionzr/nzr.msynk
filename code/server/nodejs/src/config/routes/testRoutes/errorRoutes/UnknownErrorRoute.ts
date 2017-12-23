import { Request, Response, RequestHandler } from 'express';
import AbstractTestingRoute from '../AbstractTestingRoute';

class UnknownErrorRoute extends AbstractTestingRoute {
    constructor() {
        super('/error/unknown');
    }

    public routeGet(): RequestHandler {
        let handler =  (req : Request, res : Response) : void => {
            res.sendStatus(500);
        };

        return handler;
    }
}

export default UnknownErrorRoute;