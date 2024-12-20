import AbstractConnection from "../AbstractConnection";
import { MysqlError, Connection, format, FieldInfo } from 'mysql';
import QueryResult from "../QueryResult";
import ColumnInfo from '../ColumnInfo';
import QueryParameter from "../QueryParameter";
import ConnectionState from "../ConnectionState";

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

    public close(): Promise<any> {
        this._connection.destroy();
        this._connection = null;
        return Promise.resolve();        
    }

    public query(sql: string, ...values: Array<QueryParameter>): Promise<QueryResult> {
        const promise = new Promise<QueryResult>((resolve, reject) => {
            sql = format(sql, values === null ? values : values.map((e) =>{
                return e ? e.value : null;
            }));

            this._connection.query(sql, (err, result, fields) => {                
                if (err) {
                    reject(err);
                } else {
                    const columnsInfo = this._fromFieldsInfoToColumnsInfo(fields);
                    const queryResult = new QueryResult(result, columnsInfo, result.affectedRows)
                    resolve(queryResult);
                }
            });
        });

        return promise;
    }

    public get state(): ConnectionState {
        if (this._connection != null && (this._connection.state === 'connected' ||
            this._connection.state === 'authenticated')) {
            return ConnectionState.connected;
        } else {
            return ConnectionState.disconnected;
        }
    }

    private _fromFieldsInfoToColumnsInfo(fieldsInfo: FieldInfo[]): Array<ColumnInfo> {
        const columnsInfo = new Array<ColumnInfo>();

        if (fieldsInfo) {
            for(const field of fieldsInfo) {
                const columnInfo = new ColumnInfo(field.name, field.type.toString(), 'mysql');
                columnsInfo.push(columnInfo);
            }
        }

        return columnsInfo;
    }

}

export default MySQLConnection;
