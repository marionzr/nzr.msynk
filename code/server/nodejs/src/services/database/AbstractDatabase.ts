import AbstractConnection from "./AbstractConnection";

abstract class AbstractDatabase {
    public abstract get dbType(): String;

    public abstract createConnection(): Promise<AbstractConnection>;
}

export default AbstractDatabase;
