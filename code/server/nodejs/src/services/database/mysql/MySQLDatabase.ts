
import * as mysql from 'mysql';
import { Pool, Connection, QueryOptions, MysqlError } from 'mysql';
import Log from '../../Log';
import Security from '../../security/Security';
import AbstractDatabase from '../AbstractDatabase';
import AbstractConnection from '../AbstractConnection';
import MySQLConnection from './MySQLConnection';
import DbType from '../DbType';

const TAG = new Log.TAG(__filename);

class MySQLDatabase extends AbstractDatabase {
    private _pool: Pool;
    private static _instance: MySQLDatabase; 
    private _log: Log;   

    public constructor() {
        super();
        
        this._log = Log.getInstance();
        this._pool = mysql.createPool({
            connectionLimit: process.env.MYSQL_CONNECTION_LIMIT ? parseInt(process.env.MYSQL_CONNECTION_LIMIT, 10) : 10,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: Security.decrypt(process.env.MYSQL_PASSWORD),
            database: process.env.MYSQL_DATABASE,
            connectTimeout: process.env.MYSQL_TIMEOUT ? parseInt(process.env.MYSQL_TIMEOUT, 10) : 10000
        });
    }

    public get dbType(): DbType {
        return DbType.MySQL;
    }

    public createConnection(): Promise<AbstractConnection> {
        const promise = new Promise<AbstractConnection>((resolve, reject) => {
            this._pool.getConnection((err, connection: Connection) => {
                if (err) {
                    this._log.error(TAG, err);
                    reject(err);
                } else {
                    connection.on('end', (err: MysqlError) => {
                        connection.destroy();
                        this._log.debug(TAG, `Connection ${connection.state}`);
                    });

                    this._log.debug(TAG, `Connection ${connection.state}`);
                    const mysqlConnection = new MySQLConnection(connection);                
                    resolve(mysqlConnection);
                }
            });
        });

        return promise;
    }
}

export default MySQLDatabase;
