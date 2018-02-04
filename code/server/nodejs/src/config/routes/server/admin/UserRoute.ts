import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from '../../AbstractRoute';

class StatusRoute extends AbstractRoute {
    constructor() {
        super('/server/admin/user/:username');
    }

    public get order(): number {
        return 1;
    }

    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "get user":"not implemented" }');
        };

        return handler;
    }

    public routePost(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(201).send('{ "add user":"not implemented" }');
        };

        return handler;
    }

    public routePatch(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "update user":"not implemented" }');
        };

        return handler;
    }

    public routeDelete(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "delete user":"not implemented" }');
        };

        return handler;
    }
}

export default StatusRoute;
