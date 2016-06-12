module.exports = {

	authorizationInterceptor: function(settings) {

		var bearer = settings.bearer;

		var interceptor = function(request, response, next) {
			
	    	if (bearer == null) {
	    		// Ignore authorization
	    		next();
	    		console.log('  -> Authorization (OK) No token required');
	    		return;
	    	}

	    	if (request.headers['authorization'] == undefined) {
	    		// Authorization token was expected but not sent by client
	    		response.status(403).send();
	    		response.end();
	    		console.log('  -> Authorization (Failed) Auth token is required but was not provided');
	    		return;
	    	}

	    	var bearerToken = 'Bearer ' + bearer;
	    	var result = request.headers['authorization'] === bearerToken;

	    	if (!result) {
				response.status(403).send();
				response.end();
				console.log('  -> Authorization (Failed) Invalid auth token provided');
	    	}
	    	else {
	    		console.log('  -> Authorization (OK)');
	    		next();
	    	}
		}

		return interceptor;
    }
}