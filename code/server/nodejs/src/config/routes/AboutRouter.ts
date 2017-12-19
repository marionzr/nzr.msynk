import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from './AbstractRoute';

class AboutRoute extends AbstractRoute {

    public static readonly PATH: string = '/about';
    constructor() {
        super(AboutRoute.PATH);
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