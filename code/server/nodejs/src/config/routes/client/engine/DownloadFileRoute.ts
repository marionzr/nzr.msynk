import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from '../../AbstractRoute';

class DownloadFileRoute extends AbstractRoute {
    constructor() {
        super('/client/engine/download/file/:username/:filename');
    }
    public get order(): number {
        return 1;
    }
    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "download file":"not implemented" }');
        };

        return handler;
    }
}

export default DownloadFileRoute;
