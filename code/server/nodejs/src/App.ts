import * as express from 'express';
import * as dotenv from 'dotenv';
import Express from './config/Express';
import Log from './services/Log';

const TAG: Log.TAG = new Log.TAG(__filename);

/**
 * Application class. Responsible to set up Express, Logging and Environment variables.
 *
 * @class App
 */
class App {
    /**
     * Express Http Server
     *
     * @private
     * @type {express.Application}
     * @memberof App
     */
    private _server : express.Application;
    private _log: Log;
    public static readonly VERSION = '0.0.1';

    constructor() {        
        this._configureLog();
        this._server = new Express().server;
    }

    /**
     * Configures the Log service with the defined Log.Level
     *
     * @private
     * @returns {void}
     * @memberof App
     */
    private _configureLog() :void {
        try {
            for (const value in Log.Level) {
                if (value === process.env.LOG_LEVEL) {
                    this._log = Log.getInstance();
                    this._log.level = (<any>Log.Level)[value];
                    return;
                }
            }

            this._log = Log.getInstance(); // default
            this._log.error(TAG, 'No Log.Level defined. Using error as default');
        } finally {
            process.on('uncaughtException', (err) => {
                console.error(err);
                this._log.error(TAG, `uncaughtException:' ${err.message}\n${err.stack}`); // logging with MetaData
                process.exit(1); // exit with failure
            });

            process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
                console.error('Unhandled Rejection at:', promise, 'reason:', reason);
                this._log.error(TAG, `Unhandled Rejection at: ${promise}, reason: ${reason}`);
                process.exit(1); // exit with failure
            });
        }
    }

    /**
     * Gets the express application server instance.
    */
    public get server(): express.Application {
        return this._server;
    }

    /**
     * Starts the Express Application in the defined environment Port.
     *
     * @memberof App
     */
    public start(): void {
        const port = process.env.PORT || 3000;
        this._server.listen(port, (err : Error) => {
            if (err) {
                this._log.error(TAG, err);
            }
        });
    }
}

export default App;
