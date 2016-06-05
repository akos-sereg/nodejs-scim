module.exports = {

    initUserEndpoints: function(app, domain, logger) {

		// Get Users
		app.get('/svc/scim/users', function(req, resp) {

		    console.log('[SCIM] GetUser');
		    logger.dumpRequest(req);

		    if (domain.getUsers().length > 0) {

				var responseData = { 
					totalResults: domain.getUsers().length, 
					itemsPerPage: domain.getUsers().length, 
					startIndex: 1, 
					schemas: [ 'urn:scim:schemas:core:1.0' ] 
				};

				responseData.Resources = domain.getUsers();
				resp.send(responseData);
		    }
		    else {
				resp.send({ 
					totalResults: 0, 
					itemsPerPage: 10, 
					startIndex: 1, 
					schemas: [ 'urn:scim:schemas:core:1.0' ], 
					Resources: [] 
				});
		    }
		});

		// Create User
		app.post('/svc/scim/users', function(req, resp) {

		    console.log('[SCIM] CreateUser');
		    logger.dumpRequest(req);

		    var user = req.body;
		    domain.addUser(user);

		    resp.status(201).send(user);
		});

		// Update User
		// TODO: consider 'active' header value
		app.put('/svc/scim/users/:id', function(req, resp) {

		    console.log('[SCIM] Update User');
		    logger.dumpRequest(req);

		    domain.updateUser(req.params.id, req.body);

		    resp.send(req.body);
		});

		// Get User by ID
		app.get('/svc/scim/users/:id', function(req, resp) {

		    console.log('[SCIM] Get user by ID');
		    logger.dumpRequest(req);

		    var user = domain.getUserById(req.params.id);
		    if(user != null) {
		    	resp.send(user);
		    	return;
		    }

		    resp.status(404).send();
		});
    },

    initGroupEndpoints: function(app, domain, logger) {

		// Get groups
		app.get('/svc/scim/groups', function(req, resp) {

		    console.log('[SCIM] Get Groups');
		    logger.dumpRequest(req);

		    resp.send({ 
				totalResults: domain.getGroups().length,
				itemsPerPage: domain.getGroups().length,
				startIndex: 1,
				schemas: [ 'urn:scim:schemas:core:1.0' ],
				Resources: domain.getGroups()
		    });
		});

		// Create Group
		// TODO: Consider group name collision (400 Bad Request)
		app.post('/svc/scim/groups', function(req, resp) {

		    console.log('[SCIM] Create Group');
		    logger.dumpRequest(req);

		    var group = req.body;
		    domain.addGroup(group);

		    resp.status(201).send(group);
		});

		// Update Group: Add Member
		app.patch('/svc/scim/groups/:id', function(req, resp) {

		    console.log('[SCIM] Update Group');
		    logger.dumpRequest(req);

		    var members = req.body.members;

		    try {
				domain.manageMembers(req.params.id, members);
		    }
		    catch(error) {
		    	resp.status(400).send({ 
				    Errors: { 
						description: error.message, 
						code: 400 } 
				});
		    }

		    resp.send();

		});
    },

    catchAll: function(app, logger) {

		app.post('*', function(req, resp) {
		    console.log('Unmapped request received: ');
		    logger.dumpRequest(req);

		    resp.send();
		});
    }
}