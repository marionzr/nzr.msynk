import * as chai from 'chai';
import AbstractTest from '../AbstractTest';
import DaoFactory from '../../src/services/database/DaoFactory';
import MsyDao from '../../src/app/models/daos/MsyDao';

const assert = chai.assert;

class DaoFactoryTest extends AbstractTest {
    public run(): void {
        describe('DaoFactory', () => {
            it('load', (done) => {                
                const dao: MsyDao = DaoFactory.get<MsyDao>(MsyDao);
                assert.isTrue(dao instanceof MsyDao);
                assert.equal(dao.name, 'msy_config');
                const dao2: MsyDao = DaoFactory.get<MsyDao>(MsyDao);
                assert.notEqual(dao, dao2);
                assert.equal(dao.name, dao2.name);
                done();
            });
        });
    }
}


export default new DaoFactoryTest().run();
