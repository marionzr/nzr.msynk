import AbstractTest from "../AbstractTest";
import * as chai from 'chai';
import MailSender from '../../src/services/mail/MailSender';

const assert = chai.assert;

class MailSenderTest extends AbstractTest {
    public run() {
        describe('MailSender', () => {
            it('Send a valid e-mail', (done) => {
                MailSender.send('ss4nntt0ss@gmail.com', 'test', 'test')
                .then(() => {
                    done();
                }, (err) => {
                    done(err);
                })
                .catch((err) => {
                    done(err);
                })
            });
        });
    }

}

export default new MailSenderTest().run();