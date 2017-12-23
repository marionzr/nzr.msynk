import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from '../../AbstractRoute';

class SessionRoute extends AbstractRoute {
    constructor() {
        super('/client/engine/session/:username');
    }
    public get order(): number {
        return 1;
    }
    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "session request":"not implemented" }');
        };

        return handler;
    }
    public routePost(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "session confirm":"not implemented" }');
        };

        return handler;
    }
}

export default SessionRoute;
