import * as morgan from 'morgan';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as errorhandler from 'errorhandler';
import Log from '../services/Log';
import Util from '../services/Util';
import RouteLoader from './routes/RouteLoader';
import AbstractRoute from './routes/AbstractRoute'
const TAG: Log.TAG  = new Log.TAG(__filename);
const MORGAN_TAG: Log.TAG  = new Log.TAG('morgan');


class Express {
    private readonly _server: express.Application;
    private readonly _log: Log;
    private readonly _routeLoader: RouteLoader;

    constructor(log: Log) {
        this._log = log;
        this._server = express();
        this._routeLoader = new RouteLoader(this._log);
        this._configure();
    }

    private _configure(): void {
        /**
         * Morgan to log routes.
         */
        this._server.use(morgan('common', {
            stream: {
                write: (message) => {
                    this._log.info(MORGAN_TAG, message);
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

    private addRoute(router: express.Router, route: AbstractRoute): void {
        if (route.routeGet() != null) {
            router.get(route.path, route.routeGet());
        }

        if (route.routePost() != null) {
            router.post(route.path, route.routePost());
        }
    }

    private _mountRoutes() : void {
        let routes: Array<AbstractRoute> = this._routeLoader.load();
        const router = express.Router();

        router.use((req, res, next) => {
            this._log.debug(TAG, `URL: ${req.url} from ${req.hostname}`);
            next();
        });

        routes.sort((x: AbstractRoute, y: AbstractRoute) => { return x.order - y.order; })
            .forEach((route) => {
                this.addRoute(router, route);
            });

        this._server.use('/', router);
    }

    get server(): express.Application {
        return this._server;
    }
}

export default Express;
