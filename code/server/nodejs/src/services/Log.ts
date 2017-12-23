import * as winston from 'winston';
import * as fs from 'fs';
import Util from '../services/Util';

/**
 * Logger class to wrapper an node specific logger library (currently winston)
 * see https://www.npmjs.com/package/winston-daily-rotate-file
 *
 * @class Log
 */
class Log {
    private static _instance: Log;
    private _level: Log.Level;
    private _provider: winston.LoggerInstance;
    static readonly FOLDER: string = 'logs';

    /**
     * Singleton
     *
     * @static
     * @param {Log.Level}
     * @returns {Log}
     * @memberof Log
     */
    public static getInstance(level?: Log.Level): Log {
        if (Log._instance == null || (level && Log._instance._level !== level)) {
            level = level || Log.Level.error;
            Log._instance = new Log(level);
        }

        return Log._instance;
    }

    private constructor(level: Log.Level) {
        this._level = level;
        Log.createLogFolder();
        this._configure();
    }

    /**
     * Creates the log folder (if not exits) at root folder.
     *
     * @private
     * @static
     * @memberof Log
     */
    private static createLogFolder(): void{
        if (!fs.existsSync(Log.FOLDER)) {
            fs.mkdirSync(Log.FOLDER);
        }
    }

    /**
     * Removes (unlink) the log files.
     *
     * Returns a promise with the number of deleted files.
     *
     * @static
     * @returns {Promise<number>}
     * @memberof Log
     */
    static clearLogs(): Promise<number> {
        const promise = new Promise<number>((resolve, reject) => {
            fs.exists(Log.FOLDER, (exists: boolean) => {
                if (!exists) {
                    resolve(0);
                    return;
                }

                fs.readdir(Log.FOLDER, (errReadDir: NodeJS.ErrnoException, fileNames: string[]) => {
                    if (errReadDir) {
                        reject(errReadDir);
                    } else {
                        let unlinked : number = 0;
                        const size = fileNames.length;
                        fileNames.forEach((fileName) => {
                            fileName = `${Log.FOLDER}/${fileName}`;

                            fs.unlink(fileName, (errUnlink: NodeJS.ErrnoException) => {
                                if (errUnlink) {
                                    reject(errUnlink);
                                } else {
                                    unlinked += 1;

                                    if (unlinked === size) {
                                        resolve(size);
                                    }
                                }
                            });
                        });
                    }
                });
            });
        });

        return promise;
    }

    /**
     * Gets the number of created log files.
     *
     * Returns a promise with the number of created log files.
     *
     * @static
     * @returns {Promise<number>}
     * @memberof Log
     */
    static getLogCount(): Promise<number> {
        const promise = new Promise<number>((resolve, reject) => {
            fs.exists(Log.FOLDER, (exists: boolean) => {
                if (!exists) {
                    resolve(0);
                } else {
                    fs.readdir(Log.FOLDER, (errReadDir: NodeJS.ErrnoException, fileNames: string[]) => {
                        if (errReadDir) {
                            reject(errReadDir);
                        } else {
                            resolve(fileNames.length);
                        }
                    });
                }
            });
        });

        return promise;
    }

    /**
     * Configures the transport files for winston.
     *
     * The console transport is available only if Util.isDevEnv() is true.
     *
     * @private
     * @memberof Log
     */
    private _configure(): void {
        this._provider = new winston.Logger({
            transports: [
                new winston.transports.File({
                    level: this._level,
                    showLevel: true,
                    filename: 'logs/msynk.log',
                    maxsize: 100000,
                    maxFiles: 2,
                    colorize: false,
                    handleExceptions: true,
                    humanReadableUnhandledException: true,
                }),
                new winston.transports.Console({
                    level: Log.Level.debug,
                    showLevel: true,
                    handleExceptions: true,
                    humanReadableUnhandledException: true,
                    colorize: true
                })
            ]
        });

        if (!Util.isDevEnv()) {
            this._provider.remove(winston.transports.Console);
        }
    }

    /**
     * Formats the log message
     *
     * @param tag Identifies the owner of the log entry (ex: class name, class file)
     * @param message The log message
     */
    static _format(tag: Log.TAG, message: string): string {
        return `{${tag.name}} - ${message}`; // TAG - MESSAGE;
    }


    public debug(tag: Log.TAG, message: string | any[], callback?: Log.Callback): void {
        const callbackProvider = (providerError: any, providerLevel: string, providerMessage: string) => {
            Log._runCallback(callback, providerError, Log.Level.debug, providerMessage);
        };

        if (typeof message === 'string') {
            this._provider.debug(Log._format(tag, message), callbackProvider);
        } else {
            this._provider.debug(Log._format(tag, Log._methodString(message)), callbackProvider);
        }
    }

    public verbose(tag: Log.TAG, message: string | any[], callback?: Log.Callback): void {
        const callbackProvider = (providerError: any, providerLevel: string, providerMessage: string) => {
            Log._runCallback(callback, providerError, Log.Level.verbose, providerMessage);
        };

        if (typeof message === 'string') {
            this._provider.verbose(Log._format(tag, message), callbackProvider);
        } else {
            this._provider.verbose(Log._format(tag, Log._methodString(message)), callbackProvider);
        }
    }

    public info(tag: Log.TAG, message: string | any[], callback?: Log.Callback): void {
        const callbackProvider = (providerError: any, providerLevel: string, providerMessage: string) => {
            Log._runCallback(callback, providerError, Log.Level.info, providerMessage);
        };

        if (typeof message === 'string') {
            this._provider.info(Log._format(tag, message), callbackProvider);
        } else {
            this._provider.info(Log._format(tag, Log._methodString(message)), callbackProvider);
        }
    }

    public warn(tag: Log.TAG, message: string | any[], callback?: Log.Callback): void {
        const callbackProvider = (providerError: any, providerLevel: string, providerMessage: string) => {
            Log._runCallback(callback, providerError, Log.Level.warn, providerMessage);
        };

        if (typeof message === 'string') {
            this._provider.warn(Log._format(tag, message), callbackProvider);
        } else {
            this._provider.warn(Log._format(tag, Log._methodString(message)), callbackProvider);
        }
    }

    public error(tag: Log.TAG, err: string | Error | any[], callback?: Log.Callback): void {
        const callbackProvider = (providerError: any, providerLevel: string, providerMessage: string) => {
            Log._runCallback(callback, providerError, Log.Level.error, providerMessage);
        };

        if (err instanceof Error) {
            this._provider.error(Log._format(tag, (<Error>err).message), callbackProvider);
        } else if (typeof err === 'string') {
            this._provider.error(Log._format(tag, <string>err), callbackProvider);
        } else {
            this._provider.error(Log._format(tag, `${err[0]}(${err.splice(1).join()})`), callbackProvider);
        }
    }

    private static _methodString(args: any[]): string {
        return `${args[0]}(${args.splice(1).map((s) => JSON.stringify(s)).join()})`;
    }

    /**
     * Executes the callback function. The message and the level will be sent only the the log message could be
     * saved with the current log level.
     *
     * @private
     * @static
     * @param {Log.Callback} callback
     * @param {*} providerError
     * @param {Log.Level} level
     * @param {string} providerMessage
     * @memberof Log
     */
    private static _runCallback(callback: Log.Callback, providerError: any, level: Log.Level, providerMessage: string): void {
        if (callback) {
            callback(providerError, (providerMessage || providerError) ? level : undefined, providerMessage);
        }
    }

    /**
     * Gets the current log level.
     *
     * @readonly
     * @type {Log.Level}
     * @memberof Log
     */
    public get logLevel(): Log.Level {
        return this._level;
    }
}

module Log {
    /**
     * Log levels based (currently) on Winston CliConfigSetLevels.
     *
     * @export
     * @enum {number}
     */
    export enum Level {
        silly = 'silly',
        debug = 'debug',
        verbose = 'verbose',
        info = 'info',
        warn = 'warn',
        error = 'error'
    }

    /**
     * TAG class used to better identify the owner of the log entry.
     *
     * @export
     * @class TAG
     */
    export class TAG {
        private readonly _name: string;
        /**
         * Construtor
         *
         * @param name The name of the owner of the log entry. It can be the class name,
         */
        constructor(name: string) {
            if (['\\', '/', '.js', ':'].some((c) => name.indexOf(c) !== -1)) {
                this._name = Util.getBaseName(name);
            } else {
                this._name = name;
            }
        }

        /**
         * Gets the TAG's name.
         *
         * @readonly
         * @type {string}
         * @memberof TAG
         */
        get name(): string {
            return this._name;
        }
    }

    /**
     * Callback function to indicate if the log message was saved or not.
     *
     * @memberof Log
     */
    export type Callback = (error?: Error, level?: Log.Level, message?: String) => void;
}


export default Log;
