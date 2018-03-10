import { MysqlError, Connection, format, FieldInfo } from 'mysql';
import AbstractConnection from '../AbstractConnection';
import QueryResult from '../QueryResult';
import ColumnInfo from '../ColumnInfo';
import QueryParameter from '../QueryParameter';
import ConnectionState from '../ConnectionState';
import DbType from '../DbType';

class MySQLConnection extends AbstractConnection {
    private _connection: Connection;
    
    public constructor(connection: Connection) {
        super();
        this._connection = connection;
    }

    public beginTransaction(): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this._connection.beginTransaction((err: MysqlError) => {
                if (err) {
                    reject(new Error(err.message));
                } else {
                    resolve(this);
                }
            });
        });

        return promise;
    }

    public commit(): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this._connection.commit((err: MysqlError) => {
                if (err) {
                    reject(new Error(err.message));
                } else {
                    resolve();
                }
            });
        });

        return promise;
    }

    public rollback(): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
            this._connection.rollback((err: MysqlError) => {
                if (err) {
                    reject(new Error(err.message));
                } else {
                    resolve();
                }
            });
        });

        return promise;
    }

    public closeConnection(): Promise<any> {
        this._connection.destroy();
        this._connection = null;
        return Promise.resolve();        
    }

    public query(sql: string, ...values: Array<QueryParameter>): Promise<QueryResult> {
        const promise = new Promise<QueryResult>((resolve, reject) => {
            sql = format(sql, values === null ? values : values.map((e) => {
                return e ? e.value : null;
            }));

            this._connection.query(sql, (err, result, fields) => {                
                if (err) {
                    reject(err);
                } else {
                    const columnsInfo = MySQLConnection._fromFieldsInfoToColumnsInfo(fields);
                    const queryResult = new QueryResult(result, columnsInfo, result.affectedRows);
                    resolve(queryResult);
                }
            });
        });

        return promise;
    }

    public get state(): ConnectionState {
        let state: ConnectionState;
        if (this._connection != null && (this._connection.state === 'connected' ||
            this._connection.state === 'authenticated')) {
            state = ConnectionState.connected;
        } else {
            state = ConnectionState.disconnected;
        }

        return state;
    }

    private static _fromFieldsInfoToColumnsInfo(fieldsInfo: FieldInfo[]): Array<ColumnInfo> {
        const columnsInfo: ColumnInfo[] = [];

        if (fieldsInfo) {
            for (const field of fieldsInfo) {
                const columnInfo = new ColumnInfo(field.name, field.type.toString(), DbType.MySQL);
                columnsInfo.push(columnInfo);
            }
        }

        return columnsInfo;
    }
}

export default MySQLConnection;
