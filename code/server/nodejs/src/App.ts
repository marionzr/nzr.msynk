import * as express from 'express';
import Express from './config/Express';
import * as dotenv from 'dotenv';
import Log from './services/Log';
const TAG: Log.TAG  = new Log.TAG(__filename);

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

    constructor() {
        this._configureLog();
        let result: dotenv.DotenvResult = dotenv.config({ path: './src/config/.env.properties' });

        if (result.error) {
            this._log.error(TAG, result.error);
        }

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
        for(let value in Log.Level) {
            if (value === process.env.LOG_LEVEL) {
                this._log = Log.getInstance((<any>Log.Level)[value]);
                return;
            }
        }

        this._log = Log.getInstance(Log.Level.error); //default
        this._log.error(TAG, 'No Log.Level defined. Using error as default');
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
        let port = process.env.PORT || 3000;
        this._server.listen(port, (err : Error) => {
            if (err) {
                this._log.error(TAG, err);
                return;
            }

            this._log.info(TAG, `Server is listening on ${port}\n\n\t\tPress CTRL-C to stop`);
        });
    }
}

export default App;
