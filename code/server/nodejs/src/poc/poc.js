/*console.log(__filename);
const TAG_NAME = __filename.slice(__dirname.length + 1);
console.log(TAG_NAME);
let Log = require('../../dist/services/Log');
let l = new Log.default();
console.log(typeof l);*/

/*let isFileName = ['\\','\/','.'].some((c) => __filename.indexOf(c) !== -1);
console.log('isFileName: ' + isFileName);
isFileName = isFileName = ['\\','\/','.'].some((c) => 'morgan'.indexOf(c) !== -1);
console.log('isFileName: ' + isFileName);
let u = require('../../dist/services/Util');
var path = require('path');
var scriptName = path.basename(__filename);
console.log(scriptName);
const routeLoader = require('../../dist/config/routes/RouteLoader');
let RouteLoader = new routeLoader.default(null);*/

const cipher = require("crypto-js");
const encrypt = cipher.AES.encrypt("minha senha", "mario");
console.log(encrypt.salt);
const bytes = cipher.AES.decrypt(encrypt.toString(), 'mario');
console.log(bytes);
var plaintext = bytes.toString(cipher.enc.Utf8);
console.log(plaintext);

