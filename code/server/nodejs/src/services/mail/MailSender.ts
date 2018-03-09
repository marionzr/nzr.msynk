import { SentMessageInfo, Transporter, createTransport } from 'nodemailer';
import Security from '../security/Security';


class MailSender {
    constructor() {
    }

    public report(subject: string, message: string):Promise<any> {
        return this.send('nodemailer.ssannttoss@gmail.com', subject, message);
    }

    public send(to: string, subject: string, message: string): Promise<any> {
        const transporter = MailSender._createTransport();
        const options = MailSender._createOptions(to, subject, message);
        return transporter.sendMail(options);
    }

    private static _createTransport(): Transporter {
        let password = 'nodejs123';
        
        if (process.env.MAIL_PASS) {
            password = Security.decrypt(process.env.MAIL_PASS);
        }
        
        const transporter = createTransport({
            service: process.env.MAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.MAIL_USER || 'nodemailer.ssannttoss@gmail.com',
                pass: password
            }
        });

        return transporter;
    }

    private static _createOptions(to: string, title: string, message: string): {} {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: to || process.env.MAIL_USER,
            subject: title,
            html: `<p>${message}</p>`
          };

        return mailOptions;
    }
}

export default MailSender;
