abstract class Entity {
    private _id: number;
    constructor() {

    }

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }
}

export default Entity;
