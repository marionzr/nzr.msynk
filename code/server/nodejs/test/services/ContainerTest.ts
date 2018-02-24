import * as chai from 'chai';
import AbstractTest from "../AbstractTest";
import Container from '../../src/services/container/Container';
import User from '../../src/app/models/entities/User';
import AuthenticationController from '../../src/app/controllers/AuthenticationController';

const assert = chai.assert;

class ContainerTest extends AbstractTest {
    public run(): void {
        describe('container', () => {
            const container = Container.getInstance();
            it('registry class', (done) => {
                container.registry(AuthenticationController.name, AuthenticationController, false);
                const controller = container.get(AuthenticationController.name);
                assert.exists(controller);
                done();
            });

            it('registry twice, second wins', (done) => {
                container.registry(AuthenticationController.name, AuthenticationController, false);
                const has = container.has(AuthenticationController.name);
                assert.isTrue(has);
                container.registry(AuthenticationController.name, Error, false);
                const user = container.get(AuthenticationController.name);
                assert.equal(typeof user, typeof Error);
                done();
            });

            it ('registry singleton', (done) => {
                container.registry(AuthenticationController.name, AuthenticationController, true);
                const controller1: AuthenticationController = container.get(AuthenticationController.name);
                const controller2 = container.get(AuthenticationController.name);
                assert.equal(controller1, controller2);
                done();
            });

            it ('registry non singleton', (done) => {
                container.registry(AuthenticationController.name, AuthenticationController, false);
                const controller1: AuthenticationController = container.get(AuthenticationController.name);
                const controller2: AuthenticationController = container.get(AuthenticationController.name);
                assert.notEqual(controller1, controller2);
                done();
            });
        });
    }
}

export default new ContainerTest().run();