import AbstractRoute from '../AbstractRoute';

class AbstractTestingRoute extends AbstractRoute {
    constructor(path: string, testingRoute: boolean = true) {
        super(path, testingRoute);
    }
}

export default AbstractTestingRoute;
