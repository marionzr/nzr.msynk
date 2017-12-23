import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from '../../AbstractRoute';

class UploadFileRoute extends AbstractRoute {
    constructor() {
        super('/client/engine/upload/file/:username/:filename');
    }

    public get order(): number {
        return 1;
    }

    public routePost(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            res.status(200).send('{ "upload file":"not implemented" }');
        };

        return handler;
    }
}

export default UploadFileRoute;
