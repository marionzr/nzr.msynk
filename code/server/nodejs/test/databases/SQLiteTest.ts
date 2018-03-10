import * as chai from 'chai';
import AbstractTest from '../AbstractTest';
import AbstractConnection from '../../src/services/database/AbstractConnection';
import QueryResult from '../../src/services/database/QueryResult';
import QueryParameter from '../../src/services/database/QueryParameter';
import ConnectionState from '../../src/services/database/ConnectionState';
import SQLiteDatabase from '../../src/services/database/sqlite/SQLiteDatabase';
const assert = chai.assert;
const newParam = QueryParameter.newParam;

class SQLiteTest extends AbstractTest {

    private _error(error: Error): Error {
        return error || new Error('Test failed');
    }

    public run(): void {
        
        describe('SQLite', function() {            
            this.retries(4);
            
            beforeEach(() => {
            });

            afterEach(() => {
            });

            it('connection unique', (done) => {
                SQLiteDatabase.instance.createConnection()
                .then((connection1: AbstractConnection) => {
                    SQLiteDatabase.instance.createConnection()
                    .then((connection2: AbstractConnection) => {
                        assert.notEqual(connection1, connection2);
                        SQLiteDatabase.instance.createConnection()
                        .then((connection3: AbstractConnection) => {
                            assert.notEqual(connection1, connection3);
                            SQLiteDatabase.instance.createConnection()
                            .then((connection4: AbstractConnection) => {
                                assert.notEqual(connection1, connection4);
                                done();
                            });
                        });
                    });                    
                })
                .catch((err) => {
                    done(err);
                });
            });

            it('connection stress', (done) => {
                let count = 0;
                for(let i = 0; i < 1000; i += 1) {
                    SQLiteDatabase.instance.createConnection()
                    .then((connection: AbstractConnection) => {
                        count += 1;
                        if (count === 100) {
                            done();
                        }
                    }, (err) => {
                        done(err);
                    })
                    .catch((err) => {
                        done(err);
                    });
                }
            });
        });
    }
}

export default new SQLiteTest().run();
