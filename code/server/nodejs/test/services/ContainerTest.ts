import * as chai from 'chai';
import AbstractTest from "../AbstractTest";
import Container from '../../src/services/container/Container';
import User from '../../src/app/models/entities/User';
import AuthenticationController from '../../src/app/controllers/AuthenticationController';

const assert = chai.assert;

class ContainerTest extends AbstractTest {
    public run(): void {
        describe('container', () => {
            it('registry class', (done) => {
                Container.registry(AuthenticationController.name, AuthenticationController, false);
                const controller = Container.get(AuthenticationController.name);
                assert.exists(controller);
                done();
            });

            it('registry twice, second wins', (done) => {
                Container.registry(AuthenticationController.name, AuthenticationController, false);
                const has = Container.has(AuthenticationController.name);
                assert.isTrue(has);
                Container.registry(AuthenticationController.name, Error, false);
                const user = Container.get(AuthenticationController.name);
                assert.equal(typeof user, typeof Error);
                done();
            });

            it ('registry singleton', (done) => {
                Container.registry(AuthenticationController.name, AuthenticationController, true);
                const controller1: AuthenticationController = Container.get(AuthenticationController.name);
                const controller2 = Container.get(AuthenticationController.name);
                assert.equal(controller1, controller2);
                done();
            });

            it ('registry non singleton', (done) => {
                Container.registry(AuthenticationController.name, AuthenticationController, false);
                const controller1: AuthenticationController = Container.get(AuthenticationController.name);
                const controller2: AuthenticationController = Container.get(AuthenticationController.name);
                assert.notEqual(controller1, controller2);
                done();
            });
        });
    }
}

export default new ContainerTest().run();
