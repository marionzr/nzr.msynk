import DbType from './DbType';

class ColumnInfo {
    private _name: string;
    private _type: string;
    private _dbType: DbType;
    private _nullable: boolean;

    constructor(name: string, type: string, dbType: DbType, nullable: boolean = false) {
        this._name = name;
        this._type = type;
        this._dbType = dbType;
        this._nullable = nullable;
    }

    public get name(): string {
        return this.name;
    }

    public get type(): string {
        return this._type;
    }

    public get dbType(): DbType {
        return this._dbType;
    }

    public get nullable(): boolean {
        return this._nullable;
    }
}

export default ColumnInfo;
