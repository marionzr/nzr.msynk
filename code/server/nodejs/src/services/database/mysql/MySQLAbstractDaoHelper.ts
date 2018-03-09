import AbstractDaoHelper from '../AbstractDaoHelper';
import QueryParameter from '../QueryParameter';
import QueryResult from '../QueryResult';

class MySQLAbstractDao extends AbstractDaoHelper {
    constructor(_name: string) {
        super(_name);
    }

    protected executeQuery(sql: string): Promise<QueryResult> {
        if (!super.connection) {
            return Promise.reject(this.noConnectionError());
        }

        return this.connection.query(sql, ...super.queryParameters);            
    }

    protected executeNonQuery(sql: string, queryParameters: Array<QueryParameter>): Promise<QueryResult> {
        if (!super.connection) {
            return Promise.reject(this.noConnectionError());
        }

        return this.connection.query(sql, ...super.queryParameters);
    }

    protected executeScalar(sql: string, resultAlias: string, queryParameters: Array<QueryParameter>): Promise<number> {
        if (!super.connection) {
            return Promise.reject(this.noConnectionError());
        }

        const promise = new Promise<number>((resolve, reject) => {
            this.connection.query(sql, ...super.queryParameters)
            .then((result: QueryResult) => {
                result.rows[0].resultAlias;
            }, (err) => {
                reject(err);
            });
        });

        return promise;
    }
}

export default MySQLAbstractDao;
