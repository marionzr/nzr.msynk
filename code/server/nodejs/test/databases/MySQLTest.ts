import * as chai from 'chai';
import AbstractTest from '../AbstractTest';
import MySQLDatabase from '../../src/services/database/mysql/MySQLDatabase';
import AbstractConnection from '../../src/services/database/AbstractConnection';
import QueryResult from '../../src/services/database/QueryResult';
import MsyTestTable from './MsyTestTable';
import QueryParameter from '../../src/services/database/QueryParameter';
import ConnectionState from '../../src/services/database/ConnectionState';
const assert = chai.assert;
const newParam = QueryParameter.newParam;

class MySQLTest extends AbstractTest {
    private _connection: AbstractConnection;

    private _error(error: Error): Error {
        return error || new Error('Test failed');
    }

    public run(): void {
        
        describe('MySQL', () => {
            beforeEach(() => {
                this._connection = null;
            });

            afterEach(() => {
                if (this._connection != null) {
                    this._connection.rollback();
                    this._connection.close();
                }
            })

            it('connect with valid username/password', (done) => {
                const mysql = new MySQLDatabase();
                mysql.createConnection()
                .then((connection: AbstractConnection) => {
                    this._connection = connection;
                    assert.equal(this._connection.state, ConnectionState.connected);
                    this._connection.close();
                    assert.equal(this._connection.state, ConnectionState.disconnected);
                    this._connection = null;
                    done();
                }, (err) => {
                    done(this._error(err));
                })
                .catch((err) => {
                    done(this._error(err));
                });
            });

            it('connect with invalid username/password', function (done) {
                const currentMYSQL_USER = process.env.MYSQL_USER;
                process.env.MYSQL_USER = 'INVALID';
                const mysql = new MySQLDatabase();
                process.env.MYSQL_USER = currentMYSQL_USER;
                mysql.createConnection()
                .then((connection: AbstractConnection) => {
                    assert.fail('Invalid state');
                }, (err) => {
                    done();
                })
                .catch((err) => {
                    done(this._error(err));
                });
            });

            it('create_table_insert_query', (done) => {
                const mysql = new MySQLDatabase();
                const name = 'mario';
                const newName = 'santos';
                mysql.createConnection()                
                .then((connection: AbstractConnection) => {
                    this._connection = connection;                   
                    this._createTable()
                    .then(() => {
                        this._connection.beginTransaction()
                        .then((connectionWTransaction) => {
                            assert.equal(connectionWTransaction, this._connection);
                        
                            this._insert(name)
                            .then((insertResult) => {
                                this._query(name)
                                .then((result: QueryResult) => {
                                    this._assertQueryAfterInsert(result, name, done);

                                    this._count("total")
                                    .then((result: number) => {           
                                        this._assertCountAfterInsert(result, done);

                                        this._update(newName)
                                        .then((result: QueryResult) => {
                                            this._assertUpdateResult(result, done);

                                            this._query(newName)
                                            .then((result: QueryResult<MsyTestTable>) => {
                                                this._assertQueryAfterUpdate(result, newName, done);
                                                                                 
                                                this._delete(newName)
                                                .then((result: QueryResult) => {
                                                    this._assertDelete(result, done);
                                                    
                                                    this._query(newName)
                                                    .then((result: QueryResult<MsyTestTable>) => {
                                                        assert.equal(result.rows.length, 0);  
                                                        this._connection.rollback()
                                                        .then(() => {
                                                            done();   
                                                        }, (err) => this._onReject(err, done))
                                                    }, (err) => this._onReject(err, done))                                                    
                                                }, (err) => this._onReject(err, done));
                                            }, (err) => this._onReject(err, done));
                                        }, (err) => this._onReject(err, done));
                                    }, (err) => this._onReject(err, done));
                                }, (err) => this._onReject(err, done));
                            }, (err) => this._onReject(err, done));
                        }, (err) => this._onReject(err, done));
                    }, (err) => this._onReject(err, done));
                }, (err) => this._onReject(err, done))
                .catch((err) => {
                    this._onReject(err, done)
                });
            });
        });
    }

    private _assertQueryAfterInsert(result: QueryResult, name: string, done: Function): void {
        try {
            assert.exists(result);
            result.rows.forEach((result) => {
                assert.exists(result);
                assert.equal(result.id, 1);
                assert.equal(result.name, name);
            });
        } catch(err) {            
            this._onReject(err, done);
        }
    }

    private _assertCountAfterInsert(result: number, done: Function) {
        try {
            assert.exists(result);
            assert.equal(result, 1);
        } catch(err) {            
            this._onReject(err, done);
        }
    }


    private _assertUpdateResult(result: QueryResult, done: Function): void {
        try {
            assert.exists(result);  
            assert.equal(result.rowsAffected, 1);
        } catch(err) {            
            this._onReject(err, done);
        }
    }

    private _assertQueryAfterUpdate(result: QueryResult, newName: string, done: Function) {
        try {
            assert.exists(result);
            result.rows.forEach((result) => {
                assert.exists(result);
                assert.equal(result.id, 1);
                assert.equal(result.name, newName);
            });
        } catch(err) {            
            this._onReject(err, done);
        }
    }

    private _assertDelete(result: QueryResult, done: Function) {
        try {
            assert.exists(result);  
            assert.equal(result.rowsAffected, 1);
        } catch(err) {            
            this._onReject(err, done);
        }
    }

    private _createTable(): Promise<any> {
        return this._connection.query(`
            CREATE TABLE IF NOT EXISTS msy_test_table (
                id SMALLINT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE                            
            );            
        `, null).then(() => {
            return this._connection.query(`ALTER TABLE msy_test_table  AUTO_INCREMENT = 1;`);
        });
    }

    private 

    private _insert(name: string): Promise<any> {
        return this._connection.query('INSERT INTO msy_test_table (name) VALUES (?);', newParam(name));
    }

    private _query(name: string): Promise<QueryResult<MsyTestTable>> {
        return this._connection.query('SELECT * FROM msy_test_table;', newParam(name));
    }

    private _update(newName: string): Promise<QueryResult<MsyTestTable>> {
        return this._connection.query('UPDATE msy_test_table SET name = ?;', newParam(newName));
    }

    private _delete(name: string): Promise<QueryResult<MsyTestTable>> {
        return this._connection.query('DELETE FROM msy_test_table WHERE name = ?;', newParam(name));
    }

    private _count(resultAlias: string): Promise<number> {
        const promise = new Promise<number>((resolve, reject) => {
            this._connection.query("SELECT COUNT(*) AS total FROM msy_test_table;")
            .then((result: QueryResult) => {
                 
                resolve(result.rows[0][resultAlias]);
            }, (err) => {
                reject(err);
            });
        });

        return promise;
    }

    private _onReject(err: Error, done: Function) {
        if (!err) {
            err = new Error();
        }

        done(err);
    }
}

export default new MySQLTest().run();
