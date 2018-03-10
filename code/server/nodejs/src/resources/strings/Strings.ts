class Strings {
    public SQLITE_MSY_LOCAL_USRER_CREATE =  
        `CREATE TABLE IF NOT EXISTS msy_local_user (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL
        );`;

    public SQLITE_MSY_LOCAL_USER_SELECT_BY_USERNAME = 'SELECT username, password FROM msy_local_user WHERE username = ?;';
    public SQLITE_MSY_LOCAL_USER_UPDATE_PASSWORD_BY_USERNAME = 'UPDATE msy_local_user SET password = ? WHERE username = ?;'
    public SQLITE_MSY_LOCAL_USER_INSERT = 'INSERT INTO msy_local_user VALUES (?, ?);';
    public SQLITE_MSY_LOCAL_USER_DELETE = 'DELETE FROM msy_local_user WHERE username = ?;';
}

export default Strings;
