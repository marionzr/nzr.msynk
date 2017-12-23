import * as express from 'express';
import { Request, Response, RequestHandler } from 'express';

export default abstract class AbstractRoute {
    public static readonly VERSION: string = 'v1'
    private _path: string;
    private _testingRoute: boolean;
    constructor(path: string, testingRoute: boolean = false, version: string = AbstractRoute.VERSION) {
        this._path = `/${version}${path}`;
        this._testingRoute = testingRoute;
    }

    public get order(): number {
        return 99999;
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