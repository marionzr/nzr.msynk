import * as winston from 'winston';
import * as fs from 'fs';
import Util from '../services/Util';

/**
 * Logger class to wrapper an node specific logger library (currently winston)
 * see https://www.npmjs.com/package/winston-daily-rotate-file
 */
class Log {
    private static _instance: Log;
    private _level: Log.Level;
    private _provider: winston.LoggerInstance;
    static readonly FOLDER: string = 'logs';

    public static getInstance(level: Log.Level = Log.Level.info): Log {
        if (Log._instance == null) {
            Log._instance = new Log(level);
        }

        return Log._instance;
    }

    constructor(level: Log.Level) {
        this._level = level;
        Log.createLogFolder();
        this.configure();
    }

    /**
     * Creates the log folder (if not exits) at root folder.
     */
    static createLogFolder(): void{
        if (!fs.existsSync(Log.FOLDER)) {
            fs.mkdirSync(Log.FOLDER);
        }
    }

    /**
     * Removes (unlink) the log files.
     */
    static clearLogs(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            fs.exists(Log.FOLDER, (exists: boolean) => {
                if (!exists) {
                    reject();
                    return;
                }

                fs.readdir(Log.FOLDER, (errReadDir: NodeJS.ErrnoException, fileNames: string[]) => {
                    if (errReadDir) {
                        reject(errReadDir);
                    } else {
                        let unlinked : number = 0;
                        fileNames.forEach((fileName) => {
                            fileName = `${Log.FOLDER}/${fileName}`;

                            fs.unlink(fileName, (errUnlink: NodeJS.ErrnoException) => {
                                if (errUnlink) {
                                    reject(errUnlink);
                                } else {
                                    unlinked += 1;
                                }
                            });
                        });

                        resolve(unlinked === fileNames.length);
                    }
                });
            });
        });

        return promise;
    }

    static hasLogs(): Promise<boolean> {
        let promise = new Promise<boolean>((resolve, reject) => {
            fs.exists(Log.FOLDER, (exists: boolean) => {
                if (!exists) {
                    resolve(exists);
                } else {
                    fs.readdir(Log.FOLDER, (errReadDir: NodeJS.ErrnoException, fileNames: string[]) => {
                        if (errReadDir) {
                            reject(errReadDir);
                        } else {
                            resolve(fileNames && fileNames.length > 0);
                        }
                    });
                }
            });
        });

        return promise;
    }

    /**
     * Configures the transport files for winston.
     * The console transport is available only if process.env.NODE_ENV === 'desenv'
     */
    private configure(): void {
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
     * @param tag Identifies the owner of the log entry (ex: class name, class file)
     * @param message The log message
     */
    static _format(tag: Log.TAG, message: string): string {
        return `{${tag.name}} - ${message}`; // TAG - MESSAGE;
    }

    public silly(tag: Log.TAG, message: string, callback?: Log.Callback): void {
        this._provider.silly(Log._format(tag, message), (providerError: any, providerLevel: string, providerMessage: string, meta: any) =>{
            Log._runCallback(callback, providerError, Log.Level.silly, providerMessage);
        });
    };

    public debug(tag: Log.TAG, message: string, callback?: Log.Callback): void {
        this._provider.debug(Log._format(tag, message), (providerError: any, providerLevel: string, providerMessage: string, meta: any) =>{
            Log._runCallback(callback, providerError, Log.Level.debug, providerMessage);
        });
    };

    public verbose(tag: Log.TAG, message: string, callback?: Log.Callback): void {
        this._provider.verbose(Log._format(tag, message), (providerError: any, providerLevel: string, providerMessage: string, meta: any) =>{
            Log._runCallback(callback, providerError, Log.Level.verbose, providerMessage);
        });
    };

    public info(tag: Log.TAG, message: string | any[], callback?: Log.Callback): void {
        if (typeof message === 'string') {
            this._provider.info(Log._format(tag, message), (providerError: any, providerLevel: string, providerMessage: string, meta: any) =>{
                Log._runCallback(callback, providerError, Log.Level.info, providerMessage);
            });
        } else {
            this._provider.info(Log._format(tag, `${message[0]}(${message.splice(1).map((s) => JSON.stringify(s)).join()})`), (providerError: any, providerLevel: string, providerMessage: string, meta: any) =>{
                Log._runCallback(callback, providerError, Log.Level.info, providerMessage);
            });
        }
    };

    public warn(tag: Log.TAG, message: string, callback?: Log.Callback): void {
        this._provider.warn(Log._format(tag, message), (providerError: any, providerLevel: string, providerMessage: string, meta: any) =>{
            Log._runCallback(callback, providerError, Log.Level.warn, providerMessage);
        });
    };

    public error(tag: Log.TAG, err: string | Error | any[], callback?: Log.Callback): void {
        if (err instanceof Error) {
            this._provider.error(Log._format(tag, (<Error>err).message), (providerError: any, providerLevel: string, providerMessage: string, meta: any) =>{
                Log._runCallback(callback, providerError, Log.Level.error, providerMessage);
            });
        } else {
            if (typeof err === 'string') {
                this._provider.error(Log._format(tag, <string>err), (providerError: any, providerLevel: string, providerMessage: string, meta: any) =>{
                    Log._runCallback(callback, providerError, Log.Level.error, providerMessage);
                });
            } else {
                this._provider.error(Log._format(tag, `${err[0]}(${err.splice(1).join()})`), (providerError: any, providerLevel: string, providerMessage: string, meta: any) =>{
                    Log._runCallback(callback, providerError, Log.Level.error, providerMessage);
                });
            }
        }
    };

    private static _runCallback(callback: Log.Callback, providerError: any, level: Log.Level, providerMessage: string): void {
        if (callback) {
            callback(providerError, (providerMessage || providerError) ? level : undefined, providerMessage);
        }
    }

    /**
     * Gets the current log level.
     */
    public get logLevel(): Log.Level {
        return this._level;
    }
};

module Log {
    /**
     * Log levels based (currently) on Winston CliConfigSetLevels
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
     * TAG class used to better identify the owner of the log entry
     */
    export class TAG {
        private _name: string;
        /**
         *
         * @param name The name of the owner of the log entry. It can be the class name,
         */
        constructor(name: string) {
            if (['\\','\/','.js',':'].some((c) => name.indexOf(c) !== -1)) {
                this._name = Util.getBaseName(name);
            } else {
                this._name = name;
            }
        }

        get name(): string {
            return this._name;
        }
    }

    export type Callback = (error?: Error, level?: Log.Level, message?: String) => void;
}


export default Log;
