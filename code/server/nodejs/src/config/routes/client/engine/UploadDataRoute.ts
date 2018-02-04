import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from '../../AbstractRoute';

class UploadDataRoute extends AbstractRoute {
    constructor() {
        super('/client/engine/upload/data/:username');
    }

    public get order(): number {
        return 1;
    }

    public routePost(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "upload data":"not implemented" }');
        };

        return handler;
    }
}

export default UploadDataRoute;
