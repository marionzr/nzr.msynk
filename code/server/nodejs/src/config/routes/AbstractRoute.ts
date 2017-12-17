import * as express from 'express';
import { RequestHandler } from 'express';

export default abstract class AbstractRoute {
    private _path: string;
    private _testingRoute: boolean;
    constructor(path: string, testingRoute: boolean = false) {
        this._path = path;
        this._testingRoute = testingRoute;
    }

    public routeGet(): RequestHandler {
        return null;
    }

    public routePost(): RequestHandler {
        return null;
    }

    public get path(): string {
        return this._path;
    }

    public get testingRoute(): boolean {
        return this._testingRoute;
    }
}