import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from './AbstractRoute';

class IndexRoute extends AbstractRoute {
    public static readonly PATH: string = '/';
    constructor() {
        super(IndexRoute.PATH);
    }

    public routeGet(): RequestHandler {
        let handler = (req : Request, res : Response) : void => {
            res.json({
                message: 'It works!'
            });
        };

        return handler;
    }
}

export default IndexRoute;