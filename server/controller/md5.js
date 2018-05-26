let crypto = require("crypto");


/**
 *@param {String|null} MD5 hex
 *@return {MD5|null}
*/

module.exports = (pwd)=>{
    var md5 = crypto.createHash('md5');
    var password = md5.update(pwd).digest('hex');
    return password;
}
