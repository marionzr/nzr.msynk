import ContainerItem from "./ContainerItem";
import { define } from "mime";
import Log from "../Log";

const TAG: Log.TAG = new Log.TAG(__filename);

class Container {
    private static _instance: Container;
    private _singletons: Map<Function, any>;
    private _services: Map<Function, ContainerItem>;
    private readonly _log: Log;

    private constructor() {
        this._log = Log.getInstance();    
        this._services = new Map();
        this._singletons = new Map();
    }
    public static getInstance(): Container {
        if (!Container._instance) {
            Container._instance = new Container();
        }

        return Container._instance;
    }

    public get<T>(name: Function): T {
        const service = this._services.get(name);

        if (service.definition.toString().startsWith('class')) {
            if (service.singleton) {
                const singleton = this._singletons.get(name);

                if (singleton) {
                    this._log.debug(TAG, `${this.get.name}(${name}): [singleton]${singleton})`);
                    return singleton;
                } else {
                    const instance = new service.definition();
                    this._singletons.set(name, instance);
                    this._log.debug(TAG, `${this.get.name}(${name}): [new singleton]${singleton})`);
                    return instance;
                }
            } else {
                const newDefinition = new service.definition();
                this._log.debug(TAG, `${this.get.name}(${name}): [new definition]${newDefinition})`);
                return newDefinition;
            }
        } else {
            return service.definition;
        }
    }

    public registry(name: Function, definition: any, singleton: boolean) {        
        const item = new ContainerItem(singleton, definition);
        this._services.set(name, item); 
        this._log.debug(TAG, `${this.registry.name}(${name}, ${definition}, ${singleton})`);
    }

    public has(name: Function) {
        return this._services.has(name);
    }
}

export default Container;
