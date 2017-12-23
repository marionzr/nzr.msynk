import * as morgan from 'morgan';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import Log from '../services/Log';
import * as errorhandler from 'errorhandler';
import Util from '../services/Util';

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

        if (Util.isDevEnv() || Util.isTestEnv()) {
            // only use in development
            this._server.use(errorhandler({
                log: (err: Error, message, req) => {
                    if (Util.isDevEnv()) {
                        const errorHandlerTAG = new Log.TAG('errorhandler');
                        const title = `Error in ${req.method}  ${req.url}`;
                        this._log.error(errorHandlerTAG, `${title}: ${message}`);
                    }
                }
            }))
          }

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

        if (Util.isTestEnv()) {
            router.get('/error/oops', (req : express.Request, res : express.Response) : void => {
                res.emit('error', new Error('oops!'));
            });

            router.get('/error/unknown', (req : express.Request, res : express.Response) : void => {
                res.sendStatus(500);
            });

            router.post('/ping', (req : express.Request, res : express.Response) : void => {
                if (req.body.test === 'ping') {
                    res.status(200).json('{"test":"pong"}');
                } else {
                    res.emit('error', new Error('oops!'));
                }
            });
        }


        this._server.use('/', router);
    }

    get server(): express.Application {
        return this._server;
    }
}

export default Express;
