import { Request, Response, RequestHandler, NextFunction } from 'express';
import { AbstractController, HttpStatus } from './AbstractController';
import Log from '../../services/Log';
import AuthenticationLogic from '../models/logics/AuthenticationLogic';
import User from '../models/entities/User';
import Util from '../../services/Util';

const TAG: Log.TAG = new Log.TAG(__filename);
const TOKEN_HEADER_KEY: string = 'x-access-token';
const USER_NAME_KEY: string = 'username';

class AuthenticationController extends AbstractController {
    private readonly _log: Log;
    constructor() {
        super();
        this._log = Log.getInstance();
    }

    /**
     * Handlers the authentication request.
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof AuthenticationController
     */
    public authenticate(req: Request, res: Response): void {
        this._log.debug(TAG, [this.authenticate.name, req.body, req.headers]);

        const authenticationLogic = new AuthenticationLogic();
        const user = new User(req.body.userx.name, req.body.userx.password);
        authenticationLogic.authenticate(user)
            .then((token) => {
                res.set(TOKEN_HEADER_KEY, token);
                res.set(USER_NAME_KEY, user.username);
                res.status(HttpStatus.OK);
                if (Util.isTestEnv()) {
                    res.json({ username: user.username, xAccessToken: token });
                } else {
                    res.send();
                }
            }, (err: Error) => {
                if (err) {
                    res.status(HttpStatus.UNAUTHORIZED).json(AbstractController.stringify(err)).send();
                } else {
                    res.sendStatus(HttpStatus.UNAUTHORIZED);
                }
            })
            .catch((err: Error) => {
                this._log.error(TAG, err);
                res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR).json(AbstractController.stringify(err));
            });
    }

    /**
     * Handlers request first checking if the given token still valid and
     * then proceeds to the request route using next function.
     *
     * For now, while in test mode the token will not be checked.
     * TODO: Refactor the route tests to run a before test that first authenticate the
     * test user.
     *
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {void}
     * @memberof AuthenticationController
     */
    public checkToken(req: Request, res: Response, next: NextFunction): void {
        this._log.debug(TAG, [this.authenticate.name, req.body, req.headers]);

        if (Util.isTestEnv()) {
            next();
            return;
        }

        if (req.headers[TOKEN_HEADER_KEY] === undefined) {
            res.status(HttpStatus.BAD_REQUEST);
            res.json({ message: `Header ${TOKEN_HEADER_KEY} not found` });
            return;
        } else if (req.headers[USER_NAME_KEY] === undefined) {
            res.status(HttpStatus.BAD_REQUEST);
            res.json({ message: `Header ${USER_NAME_KEY} not found` });
            return;
        }

        const authenticationLogic = new AuthenticationLogic();
        const token = req.headers[TOKEN_HEADER_KEY].toString();
        const username = req.headers[USER_NAME_KEY].toString();
        const user = new User(username, '');

        this._log.info(TAG, [this.authenticate.name, token]);

        authenticationLogic.isAuthenticated(user, token)
            .then(() => {
                next();
            }, () => {
                res.sendStatus(HttpStatus.UNAUTHORIZED);
            })
            .catch((err) => {
                res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
            });
    }
}

export default AuthenticationController;
