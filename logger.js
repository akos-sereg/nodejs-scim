module.exports = {

	loggerInterceptor: function() {
	    
	    var interceptor = function(request, response, next) {
			var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

			console.log('\r\n');
			console.log(request.method + ' ' + request.originalUrl);
		    console.log('  Authorization:\t' + request.headers['authorization']);
		    console.log('  Remote Address:\t' + ip);
		    console.log('  Query Parameters:\t' + (request.query != undefined ? JSON.stringify(request.query) : ''));
		    console.log('  Body:\t' + (request.body != undefined ? JSON.stringify(request.body) : ''));

		    next();
	    }

	    return interceptor;
	}
}