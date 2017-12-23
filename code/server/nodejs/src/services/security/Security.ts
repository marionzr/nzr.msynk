import * as CryptoJS from 'crypto-js';

class Security {
    private static _K = 'ss a nn tt o ss @ g m a i l . c o m'; 
    constructor() {

    }

    public static encrypt(value: string): string {
        let cipherText = CryptoJS.DES.encrypt(value, Security._K).toString();
        cipherText = CryptoJS.AES.encrypt(cipherText.toString(), Security._K).toString();
        return cipherText.toString();
    }

    public static decrypt(value: string): string {
        let bytes = CryptoJS.AES.decrypt(value, Security._K);
        let plaintext = bytes.toString(CryptoJS.enc.Utf8);
        bytes = CryptoJS.DES.decrypt(plaintext, Security._K);
        plaintext = bytes.toString(CryptoJS.enc.Utf8);
        return plaintext;
    }
}

export default Security;
