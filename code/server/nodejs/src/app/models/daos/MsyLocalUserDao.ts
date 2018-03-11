import MsyDao from './MsyDao';
import MsyLocalUser from '../entities/MsyLocalUser';

abstract class MsyLocalUserDao extends MsyDao {
    constructor() {
        super('msy_local_user');
    }

    abstract create(): Promise<any>;
    abstract insert(msyLocalUser: MsyLocalUser): Promise<MsyLocalUser>;
    abstract select(username: string): Promise<MsyLocalUser>;
    abstract update(msyLocalUser: MsyLocalUser): Promise<number>;
    abstract delete(msyLocalUser: MsyLocalUser): Promise<number>;
}

export default MsyLocalUserDao;
