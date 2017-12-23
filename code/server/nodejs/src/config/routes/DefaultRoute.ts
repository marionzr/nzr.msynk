import { Request, Response, RequestHandler, NextFunction } from 'express';
import AbstractRoute from './AbstractRoute';
import AuthenticationController from '../../app/controllers/AuthenticationController';

class DefaultRoute extends AbstractRoute {
    private readonly _controller: AuthenticationController;
    constructor() {
        super('/*');
        this._controller = new AuthenticationController();
    }

    public get order(): number {
        return 1;
    }

    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response, next: NextFunction) : void => {
            this._controller.checkToken(req, res, next);
        };

        return handler;
    }
}

export default DefaultRoute;
