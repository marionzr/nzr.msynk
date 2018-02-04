import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from '../../AbstractRoute';

class StatusRoute extends AbstractRoute {
    constructor() {
        super('/client/admin/registry/:username');
    }

    public get order(): number {
        return 1;
    }

    public routePost(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(201).send('{ "registry device":"not implemented" }');
        };

        return handler;
    }
}

export default StatusRoute;
