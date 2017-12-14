import * as morgan from 'morgan';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import Log from '../services/Log';

class Express {
    private readonly _server: express.Application;
    private readonly _log: Log;
    static readonly morganTAG: Log.TAG = new Log.TAG('morgan');

    constructor(log: Log) {
        this._log = log;
        this._server = express();
        this._configure();
    }

    private _configure(): void {
        /**
         * Morgan to log routes.
         */
        this._server.use(morgan('common', {
            stream: {
                write: (message) => {
                    this._log.info(Express.morganTAG, message);
                }
            }
        }));

        this._server.use(bodyParser.json());
        this._server.use(bodyParser.urlencoded());
        this._server.use(express.static('../public'));

        this._mountRoutes();
    }

    private _mountRoutes() : void {
        const router = express.Router();
        router.get('/', (req : express.Request, res : express.Response) : void => {
            res.json({
                message: 'It works!'
            });
        });

        this._server.use('/', router);
    }

    get server(): express.Application {
        return this._server;
    }
}

export default Express;
