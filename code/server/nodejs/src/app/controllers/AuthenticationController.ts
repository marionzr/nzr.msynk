import { AbstractController, HttpStatus } from './AbstractController';
import { Request, Response, RequestHandler, NextFunction } from 'express';
import Log from '../../services/Log';
import AuthenticationLogic from '../models/logics/AuthenticationLogic';
import User from '../models/entities/User';
import Util from '../../services/Util';

const TAG: Log.TAG  = new Log.TAG(__filename);
const TOKEN_HEADER_KEY: string = 'x-access-token';
const USER_NAME_KEY: string = 'username';
const stringify = AbstractController.stringify;

class AuthenticationController extends AbstractController {

    private readonly _log: Log = Log.getInstance();
    constructor() {
        super();
    }

    public authenticate(req: Request, res: Response): void {
        const authenticationLogic = new AuthenticationLogic();
        const user = new User(req.body.userx.name, req.body.userx.password);
        authenticationLogic.authenticate(user)
            .then((authenticatedUser) => {
                res.set(TOKEN_HEADER_KEY, authenticatedUser.token);
                res.status(HttpStatus.OK);
                res.end();
            }, (err) => {
                if (err) {
                    res.status(HttpStatus.UNAUTHORIZED).json(stringify(err));
                } else {
                    res.sendStatus(HttpStatus.UNAUTHORIZED);
                }
            })
            .catch((err) => {
                res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR).json(stringify(err));
            });
    }

    public checkToken(req: Request, res: Response, next: NextFunction): void {
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
