import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from './AbstractRoute';

class IndexRoute extends AbstractRoute {
    constructor() {
        super('/');
    }

    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.json({
                message: 'It works!'
            });
        };

        return handler;
    }
}

export default IndexRoute;
