import { Request, Response, RequestHandler } from 'express';
import AbstractTestingRoute from '../AbstractTestingRoute';

class UnknownErrorRoute extends AbstractTestingRoute {
    public static readonly PATH: string = '/error/unknown';

    constructor() {
        super(UnknownErrorRoute.PATH);
    }

    public routeGet(): RequestHandler {
        let handler =  (req : Request, res : Response) : void => {
            res.sendStatus(500);
        };

        return handler;
    }
}

export default UnknownErrorRoute;