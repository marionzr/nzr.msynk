import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from '../../AbstractRoute';

class DownloadDataRoute extends AbstractRoute {
    constructor() {
        super('/client/engine/download/data/:username');
    }

    public get order(): number {
        return 1;
    }

    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "download data":"not implemented" }');
        };

        return handler;
    }
}

export default DownloadDataRoute;
