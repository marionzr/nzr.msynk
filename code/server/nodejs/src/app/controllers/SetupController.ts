import * as fs from 'fs';
import { Request, Response, RequestHandler, NextFunction } from 'express';
import { AbstractController, HttpStatus } from './AbstractController';
import Log from '../../services/Log';
import Util from '../../services/Util';
import LocalAuthenticationStrategy from '../../services/authentication/LocalAuthenticationStrategy';
import Cluster from '../../Cluster';
import AuthenticationController from './AuthenticationController';

const TAG: Log.TAG = new Log.TAG(__filename);
const TOKEN_HEADER_KEY: string = 'x-access-token';
const USER_NAME_KEY: string = 'username';

class SetupController extends AbstractController {
    private readonly _log: Log;
    private static RESTART_TIMEOUT = 3;
    constructor() {
        super();
        this._log = Log.getInstance();
    }

    /**
     * Handlers the password creation request.
     *
     * @param {Request} req
     * @param {Response} res
     * @memberof SetupController
     */
    public createPassword(req: Request, res: Response): void {
        this._log.debug(TAG, [this.createPassword.name, req.body, req.headers]);
        
        if (req.params.what !== 'msyencrypt' || req.params.extra === '') {
            res.sendStatus(HttpStatus.BAD_REQUEST).send('Invalid parameters.');
        } else {
            const plainPassword = req.params.extra;
            const encryptedPassword = LocalAuthenticationStrategy.encryptPassword(plainPassword);
            res.status(200).send(encryptedPassword);
        }
    }

    /**
     * Handlers the upload .env.properties file
     *
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {void}
     * @memberof AuthenticationController
     */
    public uploadProperties(req: Request, res: Response): void {
        this._log.debug(TAG, [this.uploadProperties.name, req.body, req.headers]);

        new AuthenticationController().checkToken(req, res, () => {
            if (req.params.what !== 'properties') {
                res.status(HttpStatus.BAD_REQUEST).send('Invalid parameters.');
                return;
            }

            req.pipe(fs.createWriteStream('.env.properties'))
                .on('finish', () => {
                    const restartMesssage = `.env.properties changed. Server will restart in ${SetupController.RESTART_TIMEOUT} seconds.`;
                    this._log.info(TAG, restartMesssage);
                    res.status(201).send(restartMesssage);

                    setTimeout(() => {
                        Cluster.restart('.env.properties changed');
                    }, 3000);
                });
        });
    }
}

export default SetupController;
