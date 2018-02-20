import ContainerItem from "./ContainerItem";
import { define } from "mime";

class Container {
    private static _instance: Container;
    private _singletons: Map<string, any>;
    private _services: Map<string, ContainerItem>;
    private constructor() {
        this._services = new Map();
        this._singletons = new Map();
    }
    public static getInstance(): Container {
        if (!Container._instance) {
            Container._instance = new Container();
        }

        return Container._instance;
    }
    public get(name: string) {
        const service = this._services.get(name);

        if (service.definition.toString().startsWith('class')) {
            if (service.singleton) {
                const singleton = this._singletons.get(name);

                if (singleton) {
                    return singleton;
                } else {
                    const instance = new service.definition();
                    this._singletons.set(name, instance);
                    return instance;
                }
            } else {
                return new service.definition();
            }

        } else {
            return service.definition;
        }
    }

    public registry(name: string, definition: any, singleton: boolean) {
        const item = new ContainerItem(singleton, definition);
        this._services.set(name, item); 
    }

    public has(name: string) {
        return this._services.has(name);
    }
}

export default Container.getInstance();
