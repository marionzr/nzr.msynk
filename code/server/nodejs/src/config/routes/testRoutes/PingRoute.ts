import { Request, Response, RequestHandler } from 'express';
import AbstractTestingRoute from './AbstractTestingRoute';

class PingRoute extends AbstractTestingRoute {
    constructor() {
        super('/ping');
    }

    public routePost(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            if (req.body.test === 'ping') {
                res.status(200).json('{"test":"pong"}');
            } else {
                res.emit('error', new Error('oops!'));
            }
        };

        return handler;
    }
}

export default PingRoute;
