import ColumnInfo from './ColumnInfo';

class QueryResult<T = any> {
    private _rows: T[];
    private _columnsInfo: Array<ColumnInfo>;
    private _rowsAffected: number;

    constructor(rows: any[], columnsInfo: Array<ColumnInfo>, rowsAffected: number) {
        this._rows = rows;
        this._columnsInfo = columnsInfo;
        this._rowsAffected = rowsAffected;
    }

    public get rows(): T[] {
        return this._rows;
    }

    public get columnsInfo(): Array<ColumnInfo> {
        return this._columnsInfo;
    }

    public get rowsAffected(): number {
        return this._rowsAffected;
    }
}


export default QueryResult; 
