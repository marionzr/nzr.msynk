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

/**
 * Configures the Express
 *
 * @class Express
 */
class Express {
    private readonly _server: express.Application;
    private readonly _log: Log;
    private readonly _routeLoader: RouteLoader;

    constructor() {
        this._log = Log.getInstance();
        this._server = express();
        this._routeLoader = new RouteLoader();
        this._configureMiddlewares();
        this._mountRoutes();
    }

    /**
     * Configures the middlewares used by the Express.
     *
     * @private
     * @memberof Express
     */
    private _configureMiddlewares(): void {
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
                        const title = `Error in ${req.method} ${req.url}.`;
                        this._log.error(errorHandlerTAG, `${title}: ${message}.`);
                    }
                }
            }))
        }

        const bodyParserJsonLimit: number = process.env.BODY_PARSER_JSON_LIMIT ?
            parseInt(process.env.BODY_PARSER_JSON_LIMIT) : 1000000;

        this._server.use(bodyParser.json({ limit: bodyParserJsonLimit}));
        this._server.use(bodyParser.urlencoded({ extended: true }));
        this._server.use(express.static('../public', { redirect: true }));
    }

    /**
     * Loads the routers into the Express.
     *
     * @private
     * @param {express.Router} router
     * @param {AbstractRoute} route
     * @memberof Express
     */
    private _addRoute(router: express.Router, route: AbstractRoute): void {
        if (route.routeGet() != null) {
            router.get(route.path, route.routeGet());
        }

        if (route.routePost() != null) {
            router.post(route.path, route.routePost());
        }
    }

    /**
     * Loads the routers into the Express.
     *
     * First asks the RouteLoader to load all the routes, ignoring the test routes
     * and then order the routes by the its order property.
     *
     * @private
     * @memberof Express
     */
    private _mountRoutes() : void {
        let routes: Array<AbstractRoute> = this._routeLoader.load();
        const router = express.Router({ caseSensitive: true });

        router.use((req, res, next) => {
            this._log.debug(TAG, `URL: ${req.url} from ${req.hostname}`);
            next();
        });

        routes.sort((x: AbstractRoute, y: AbstractRoute) => { return x.order - y.order; })
            .forEach((route) => {
                this._addRoute(router, route);
            });

        this._server.use('/', router);
    }

    get server(): express.Application {
        return this._server;
    }
}

export default Express;
