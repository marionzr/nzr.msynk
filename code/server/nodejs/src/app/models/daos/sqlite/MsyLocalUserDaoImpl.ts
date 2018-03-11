import MsyLocalUserDao from '../MsyLocalUserDao';
import SQLiteDaoHelper from '../../../../services/database/sqlite/SQLiteDaoHelper';
import R from '../../../../resources/R';
import QueryResult from '../../../../services/database/QueryResult';
import MsyLocalUser from '../../entities/MsyLocalUser';

class MsyLocalUserDaoImpl extends MsyLocalUserDao {
    private readonly _helper: SQLiteDaoHelper;
    constructor() {
        super();   
        this._helper = new SQLiteDaoHelper(this);
    }

    public create(): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            this._helper.executeNonQuery(R.strings.SQLITE_MSY_LOCAL_USRER_CREATE)
            .then((result: QueryResult) => {
                resolve();
            }, (err) => {
                reject(err);
            });
        });

        return promise;
    }
    public insert(msyLocalUser: MsyLocalUser): Promise<MsyLocalUser> {
        const promise = new Promise<MsyLocalUser>((resolve, reject) => {            
            this._helper.addParameter(msyLocalUser.username);
            this._helper.addParameter(msyLocalUser.password);
            this._helper.executeNonQuery(R.strings.SQLITE_MSY_LOCAL_USER_INSERT)
            .then((result: QueryResult) => {
                if (msyLocalUser.id === 0 || msyLocalUser.id === undefined) {
                    msyLocalUser.id = result.insertId;
                } 

                resolve(msyLocalUser);
            }, (err) => {
                reject(err);
            });
        });

        return promise;
    }
    public select(username: string): Promise<MsyLocalUser> {
        const promise = new Promise<MsyLocalUser>((resolve, reject) => {
            this._helper.addParameter(username);
            this._helper.executeQuery(R.strings.SQLITE_MSY_LOCAL_USER_SELECT_BY_USERNAME)
            .then((result: QueryResult) => {
                if (result.rows.length === 1) {
                    const msyLocalUser = new MsyLocalUser(result.rows[0].username, result.rows[0].password);
                    msyLocalUser.id = result.rows[0].rowid;
                    resolve(msyLocalUser);
                } else {
                    resolve(null);
                }
            }, (err) => {
                reject(err);
            });
        });

        return promise;
    }
    public update(msyLocalUser: MsyLocalUser): Promise<number> {
        const promise = new Promise<number>((resolve, reject) => {
            this._helper.addParameter(msyLocalUser.password);
            this._helper.addParameter(msyLocalUser.username);
            this._helper.executeQuery(R.strings.SQLITE_MSY_LOCAL_USER_UPDATE_PASSWORD_BY_USERNAME)
            .then((result: QueryResult) => {
                resolve(result.rowsAffected);
            }, (err) => {
                reject(err);
            });
        });

        return promise;
    }
    public delete(msyLocalUser: MsyLocalUser): Promise<number> {
        const promise = new Promise<number>((resolve, reject) => {
            this._helper.addParameter(msyLocalUser.username);
            this._helper.executeQuery(R.strings.SQLITE_MSY_LOCAL_USER_DELETE)
            .then((result: QueryResult) => {
                resolve(result.rowsAffected);
            }, (err) => {
                reject(err);
            });
        });

        return promise;
    }
}

export default MsyLocalUserDaoImpl;
