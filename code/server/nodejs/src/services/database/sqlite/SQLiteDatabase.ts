import { Database, RunResult, Statement, cached } from 'sqlite3';
import Log from '../../Log';
import Security from '../../security/Security';
import AbstractDatabase from '../AbstractDatabase';
import AbstractConnection from '../AbstractConnection';
import DbType from '../DbType';
import SQLiteConnection from './SQLiteConnection';

const TAG = new Log.TAG(__filename);

class SQLiteDatabase extends AbstractDatabase {
    private static _instance: SQLiteDatabase; 
    private _db: Database;
    public static ADMIN = 'madmin';
    private static USER_DB = 'user.db';
    private static initialized = false;
    private _log: Log;  
    private _instance: SQLiteDatabase;

    private constructor(public dbType = DbType.SQLite) {
        super();
        
        this._log = Log.getInstance();

        this._db = cached.Database('user.db', (err: Error) => {
            if (err) {
                this._log.error(TAG, err);
            }
        });
    }

    public static get instance(): SQLiteDatabase {
        if (SQLiteDatabase._instance == null) {
            SQLiteDatabase._instance = new SQLiteDatabase();
        }

        return SQLiteDatabase._instance;
    }

    public createConnection(): Promise<AbstractConnection> {
        const promise = new Promise<AbstractConnection>((resolve, reject) => {
            this._db = cached.Database('user.db', (err: Error) => {
                if (err) {
                    this._log.error(TAG, err);
                    reject(err);
                } else {
                    this._db.on('error', (err: Error) => {
                        this._log.error(TAG, err);
                    });

                    this._db.on('open', () => {
                        this._log.debug(TAG, `Connection ${'open'}`);
                    });

                    this._db.on('close', () => {
                        this._log.debug(TAG, `Connection ${'closed'}`);
                    });

                    const sqliteConnection = new SQLiteConnection(this._db);                
                    resolve(sqliteConnection);
                }
            });
        });

        return promise;
    }
}

export default SQLiteDatabase;
