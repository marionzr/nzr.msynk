import { Request, Response, RequestHandler } from 'express';
import { HttpStatus } from '../../app/controllers/AbstractController';
import AbstractRoute from './AbstractRoute';
import RouteLoader from './RouteLoader';
import SetupController from '../../app/controllers/SetupController';


class SetupRoute extends AbstractRoute {
    private readonly _controller: SetupController;

    public get order(): number {
        return -1;
    }

    constructor() {
        super('/setup/:what/:extra?');
        this._controller = new SetupController();
    }

    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            if (req.params.what === 'msyencrypt') {
                this._controller.createPassword(req, res);
            } 
        };

        return handler;
    }

    public routePost(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            if (req.params.what === 'properties') {
                this._controller.uploadProperties(req, res);
            } else {
                res.sendStatus(HttpStatus.BAD_REQUEST);
            }
        };

        return handler;
    }
}

export default SetupRoute;
