import { Request, Response, RequestHandler } from 'express';
import AbstractTestingRoute from './AbstractTestingRoute';

class PingRoute extends AbstractTestingRoute {
    public static readonly PATH: string = '/ping';

    constructor() {
        super(PingRoute.PATH);
    }

    public routePost(): RequestHandler {
        let handler = (req : Request, res : Response) : void => {
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