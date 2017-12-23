import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from './AbstractRoute';

class AboutRoute extends AbstractRoute {

    constructor() {
        super('/about');
    }

    public get order(): number {
        return 0;
    }


    public routeGet(): RequestHandler {
        let handler = (req : Request, res : Response) : void => {
            res.json({
                message: 'MSYNKHRONIZER 0.0.1'
            });
        };

        return handler;
    }
}

export default AboutRoute;