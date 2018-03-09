import ColumnInfo from './ColumnInfo';

class QueryParameter<T = any> {
    private readonly _columnInfo: ColumnInfo;
    private readonly _value: T;

    constructor(value: T, columnInfo?: ColumnInfo) {
        this._columnInfo = columnInfo;
        this._value = value;
    }

    public get columnInfo(): ColumnInfo {
        return this._columnInfo;
    }

    public get value(): T {
        return this._value;
    }

    public static newParam<T = any>(value: T, columnInfo?: ColumnInfo) {
        return new QueryParameter<T>(value, columnInfo);
    }
}

export default QueryParameter;
