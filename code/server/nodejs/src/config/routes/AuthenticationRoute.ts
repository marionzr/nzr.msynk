import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from './AbstractRoute';
import AuthenticationController from '../../app/controllers/AuthenticationController';

class AuthenticationRoute extends AbstractRoute {
    private readonly _controller: AuthenticationController;
    constructor() {
        super('/auth');
        this._controller = new AuthenticationController();
    }

    public get order(): number {
        return 0;
    }

    public routePost(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            this._controller.authenticate(req, res);
        };

        return handler;
    }
}

export default AuthenticationRoute;
