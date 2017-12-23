class ContainerItem {
    private readonly _singleton: boolean;
    private readonly _definition: any;
    constructor(singleton: boolean, definition: any, ) {
        this._singleton = singleton;
        this._definition = definition;
    }

    public get singleton(): boolean {
        return this._singleton;
    }

    public get definition(): any {
        return this._definition;
    }
}

export default ContainerItem;
