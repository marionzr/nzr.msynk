import Log from './../src/services/Log';
import * as chai from 'chai';

abstract class AbstractTest {
    protected _log: Log;
    protected _assert = chai.assert;
    protected readonly TAG: Log.TAG;
    constructor() {
        this._log = new Log(Log.Level.debug);
        this.TAG = this.createLogTAG();
    }

    protected abstract createLogTAG(): Log.TAG;

    public abstract run(): void;

}

export default AbstractTest;
