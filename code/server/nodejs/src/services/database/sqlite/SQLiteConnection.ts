import { Database, RunResult, Statement } from 'sqlite3';
import AbstractConnection from '../AbstractConnection';
import QueryResult from '../QueryResult';
import ColumnInfo from '../ColumnInfo';
import QueryParameter from '../QueryParameter';
import ConnectionState from '../ConnectionState';

class SQLiteConnection extends AbstractConnection {
    private _connection: Database;

    public constructor(connection: Database) {
        super();
        this._connection = connection;
    }

    public beginTransaction(): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this._connection.run('BEGIN;', null, (result: RunResult, err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        return promise;
    }

    public commit(): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this._connection.run('COMMIT;', null, (result: RunResult, err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        return promise;
    }

    public rollback(): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this._connection.run('ROLLBACK;', null, (result: RunResult, err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        return promise;
    }

    public closeConnection(): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            this._connection.close((err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }

                this._connection = null;
            });
        });
        
        return promise;
    }

    public query(sql: string, ...values: Array<QueryParameter>): Promise<QueryResult> {
        const promise = new Promise<QueryResult>((resolve, reject) => {
            const stm = this._connection.prepare(sql, values.map((v) => v.value));  
            
            if (sql.toUpperCase().startsWith('SELECT')) {
                stm.all((err: Error, rows: any[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        const queryResult = new QueryResult(rows, null, rows.length);
                        resolve(queryResult);
                    }
                }); 
            } else {
                stm.run(function(err: Error) {
                    if (err) {
                        reject(err);
                    } else {          
                        const queryResult = new QueryResult([], null, this.changes, this.lastID);
                        resolve(queryResult);
                    }
                }); 
            }
        });

        return promise;
    }

    public get state(): ConnectionState {
        let state: ConnectionState;
        if (this._connection != null) {
            state = ConnectionState.connected;
        } else {
            state = ConnectionState.disconnected;
        }

        return state;
    }
}

export default SQLiteConnection;
