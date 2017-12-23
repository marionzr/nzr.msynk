import { AbstractController, HttpStatus } from './AbstractController';
import { Request, Response, RequestHandler, NextFunction } from 'express';
import Log from '../../services/Log';
import AuthenticationLogic from '../models/logics/AuthenticationLogic';
import User from '../models/entities/User';
import Util from '../../services/Util';

const TAG: Log.TAG  = new Log.TAG(__filename);
const stringify = AbstractController.stringify;

const TOKEN_HEADER_KEY: string = 'x-access-token';
const USER_NAME_KEY: string = 'username';


class AuthenticationController extends AbstractController {

    private readonly _log: Log;
    constructor() {
        super();
        this._log = Log.getInstance();
    }

    public authenticate(req: Request, res: Response): void {
        this._log.info(TAG, [this.authenticate.name, req.body,req.headers]);

        const authenticationLogic = new AuthenticationLogic();
        const user = new User(req.body.userx.name, req.body.userx.password);
        authenticationLogic.authenticate(user)
            .then((authenticatedUser) => {
                this._log.info(TAG, `User ${authenticatedUser.name} authenticated with token ${authenticatedUser.token}`);
                res.set(TOKEN_HEADER_KEY, authenticatedUser.token);
                res.status(HttpStatus.OK);
                if (Util.isTestEnv()) {
                    res.json({ token: authenticatedUser.token });
                } else {
                    res.send();
                }
            }, (err: Error) => {
                if (err) {
                    this._log.error(TAG, `Invalid login for user ${user.name}\nError: ${err.message}\nStack: ${err.stack}`);
                    res.status(HttpStatus.UNAUTHORIZED).json(stringify(err));
                } else {
                    this._log.info(TAG, `Invalid login for user ${user.name}`);
                    res.sendStatus(HttpStatus.UNAUTHORIZED);
                }
            })
            .catch((err: Error) => {
                this._log.error(TAG, err);
                res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR).json(stringify(err));
            });
    }

    public checkToken(req: Request, res: Response, next: NextFunction): void {
        this._log.info(TAG, [this.authenticate.name, req.body, req.headers]);

        if (Util.isTestEnv()) {
            next();
            return;
        }

        if (req.headers[TOKEN_HEADER_KEY] == undefined) {
            res.status(HttpStatus.BAD_REQUEST);
            res.json({ message: `Header ${TOKEN_HEADER_KEY} not found` });
            return;
        } else if (req.headers[USER_NAME_KEY] == undefined) {
            res.status(HttpStatus.BAD_REQUEST);
            res.json({ message: `Header ${USER_NAME_KEY} not found` });
            return;
        }

        const authenticationLogic = new AuthenticationLogic();
        const token = req.headers[TOKEN_HEADER_KEY].toString();
        const username = req.headers[USER_NAME_KEY].toString();
        const user = new User(username, '');
        user.token = token;

        this._log.info(TAG, [this.authenticate.name, token]);

        authenticationLogic.isAuthenticated(user)
            .then((isAuthenticated) => {
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
