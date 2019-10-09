const crypto = require('crypto');
function chgpwd(pwd,hix){
	var md5 = crypto.createHash('md5');
	var result = md5.update(pwd+hix).digest('hex');
	return result
}
exports.chgpwd = chgpwd;