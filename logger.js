module.exports = {
	dumpRequest: function(request) {
	    
	    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

	    console.log('\tURL:\t' + request.originalUrl);
	    console.log('\tAuthorization:\t' + request.headers['authorization']);
	    console.log('\tRemote Address:\t' + ip);
	    console.log('\tBody:\t' + JSON.stringify(request.body));
	    console.log('\r\n');
	}
}