import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from '../../AbstractRoute';

class InitRoute extends AbstractRoute {
    constructor() {
        super('/server/engine/init');
    }

    public get order(): number {
        return 1;
    }

    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "init":"not implemented"}');
        };

        return handler;
    }

    public routePost(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "init":"not implemented"}');
        };

        return handler;
    }
}

export default InitRoute;
