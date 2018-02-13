import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from './AbstractRoute';
import App from '../../App';

class AboutRoute extends AbstractRoute {
    constructor() {
        super('/about');
    }

    public get order(): number {
        return -1;
    }

    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.json({
                message: `MSYNKHRONIZER ${App.VERSION}`
            });
        };

        return handler;
    }
}

export default AboutRoute;
