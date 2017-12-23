import * as express from 'express';
import Express from './config/Express';
import * as dotenv from 'dotenv';
import Log from './services/Log';
const TAG: Log.TAG  = new Log.TAG(__filename);

class App {
    private _server : express.Application;
    private _log: Log;

    constructor() {
        let result: dotenv.DotenvResult = dotenv.config({ path: './src/config/.env.properties' });
        this._configureLog();
        this._server = new Express(this._log).server;
    }

    private _configureLog() :void {
        for(let value in Log.Level) {
            if (value === process.env.LOG_LEVEL) {
                this._log = new Log((<any>Log.Level)[value]);
                return;
            }
        }

        this._log = new Log(Log.Level.error); //default
    }

    /**
     * Gets the express application server instance.
     */
    public get server(): express.Application {
        return this._server;
    }

    /**
     * Gets the global log instance.
     */
    public get log() : Log {
        return this._log;
    }

    /**
     * Starts the app
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
