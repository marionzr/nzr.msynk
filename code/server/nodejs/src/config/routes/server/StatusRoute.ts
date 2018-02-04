import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from '../AbstractRoute';

class StatusRoute extends AbstractRoute {
    constructor() {
        super('/server/status');
    }

    public get order(): number {
        return 1;
    }

    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "status":"not implemented" }');
        };

        return handler;
    }
}

export default StatusRoute;
