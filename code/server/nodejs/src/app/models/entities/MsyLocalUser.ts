import Entity from './Entity';

class MsyLocalUser extends Entity {
    constructor(public username?: string, public password?: string) {
        super();
    }
}

export default MsyLocalUser;
