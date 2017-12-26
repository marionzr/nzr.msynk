import * as express from 'express';
import { Request, Response, RequestHandler } from 'express';

/**
 * AbstractRoute class with template methods to defined http-verb routes,
 * the route order and the path.
 *
 * @export
 * @abstract
 * @class AbstractRoute
 */
export default abstract class AbstractRoute {
    /**
     * Current routes default version.
     *
     * @static
     * @type {string}
     * @memberof AbstractRoute
     */
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

    /**
     * Tells it this route is for test purpose only.
     *
     * @readonly
     * @type {boolean}
     * @memberof AbstractRoute
     */
    public get testingRoute(): boolean {
        return this._testingRoute;
    }
}