import Strings from './strings/Strings';

class R {
    private readonly _strings: Strings;

    constructor() {
        this._strings = new Strings();
    }

    public get strings(): Strings {
        return this._strings;
    }
}

export default new R();
