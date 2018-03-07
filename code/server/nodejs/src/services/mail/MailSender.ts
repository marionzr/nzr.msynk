import Security from '../security/Security';
import { SentMessageInfo, Transporter, createTransport } from 'nodemailer';


class MailSender {
    constructor() {
    }

    public report(subject: string, message: string):Promise<any> {
        return this.send('nodemailer.ssannttoss@gmail.com', subject, message);
    }

    public send(to: string, subject: string, message: string): Promise<any> {
        const transporter = this._createTransport();
        const options = this._createOptions(to, subject, message);
        return transporter.sendMail(options);
    }

    private _createTransport(): Transporter {
        let pass = 'nodejs123'; //default
        
        if (process.env.MAIL_PASS) {
            pass = Security.decrypt(process.env.MAIL_PASS);
        }
        
        const transporter = createTransport({
            service: process.env.MAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.MAIL_USER || 'nodemailer.ssannttoss@gmail.com',
                pass: pass
            }
        });

        return transporter;
    }

    private _createOptions(to: string, subject: string, message: string): {} {
        const mailOptions = {
            from: process.env.MAIL_USER, // sender address
            to: to || process.env.MAIL_USER, // list of receivers
            subject: subject, // Subject line
            html: `<p>${message}</p>`// plain text body
          };

        return mailOptions;
    }
}

export default MailSender;
