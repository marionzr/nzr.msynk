import { Request, Response, RequestHandler } from 'express';
import AbstractRoute from './AbstractRoute';
import RouteLoader from './RouteLoader';

class IndexRoute extends AbstractRoute {
    constructor() {
        super('/');
    }

    public routeGet(): RequestHandler {
        const handler = (req : Request, res : Response) : void => {
            const routeLoader: RouteLoader = new RouteLoader();
            const routes: Array<AbstractRoute> = routeLoader.load();
            const routeDescription = RouteLoader.routesJSON(routes);
            
            res.json({
                routeDescription
            });
        };

        return handler;
    }
}

export default IndexRoute;
