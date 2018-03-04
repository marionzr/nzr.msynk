import AbstractDao from "../AbstractDao";
import QueryParameter from "../QueryParameter";
import QueryResult from "../QueryResult";

abstract class MySQLAbstractDao extends AbstractDao {
    constructor() {
        super();
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
            })
        });

        return promise;
    }


}