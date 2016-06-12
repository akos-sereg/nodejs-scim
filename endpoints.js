module.exports = {

    initUserEndpoints: function(app, domain) {

		// Get Users
		app.get('/svc/scim/users', function(req, resp) {

		    var startIndex = req.query.startIndex ? req.query.startIndex : 1;
		    var users = domain.getUsers(startIndex);

		    if (users.length > 0) {

				var responseData = { 
					totalResults: users.length, 
					itemsPerPage: users.length, 
					startIndex: startIndex, 
					schemas: [ 'urn:scim:schemas:core:1.0' ] 
				};

				responseData.Resources = domain.getUsers();
				resp.send(responseData);
		    }
		    else {
				resp.status(404).send({ 
					totalResults: 0, 
					itemsPerPage: 0, 
					startIndex: startIndex, 
					schemas: [ 'urn:scim:schemas:core:1.0' ], 
					Resources: [] 
				});
		    }
		});

		// Create User
		app.post('/svc/scim/users', function(req, resp) {

		    var user = req.body;
		    domain.addUser(user);

		    resp.status(201).send(user);
		});

		// Update User
		// TODO: consider 'active' header value
		app.put('/svc/scim/users/:id', function(req, resp) {

		    domain.updateUser(req.params.id, req.body);

		    resp.send(req.body);
		});

		// Get User by ID
		app.get('/svc/scim/users/:id', function(req, resp) {

		    var user = domain.getUserById(req.params.id);
		    if(user != null) {
		    	resp.send(user);
		    	return;
		    }

		    resp.status(404).send();
		});

		app.delete('/svc/scim/users/:id', function(req, resp) {
			
			domain.deleteUserById(req.params.id);
			resp.send();
		});
    },

    initGroupEndpoints: function(app, domain) {

		// Get groups
		app.get('/svc/scim/groups', function(req, resp) {

		    var startIndex = req.query.startIndex ? req.query.startIndex : 1;
		    var groups = domain.getGroups(startIndex);
		    resp.send({ 
				totalResults: groups.length,
				itemsPerPage: groups.length,
				startIndex: startIndex,
				schemas: [ 'urn:scim:schemas:core:1.0' ],
				Resources: groups
		    });
		});

		// Create Group
		app.post('/svc/scim/groups', function(req, resp) {

		    var group = req.body;

		    var groups = domain.getGroups();
		    for (var i=0; i!=groups.length; i++) {
		    	if (groups[i].displayName == group.displayName) {
					resp.status(400).send();		    		
					return;
		    	}
		    }

		    domain.addGroup(group);

		    resp.status(201).send(group);
		});

		// Update Group: Add Member
		app.patch('/svc/scim/groups/:id', function(req, resp) {

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

		// Delete Group
		app.delete('/svc/scim/groups/:id', function(req, resp) {

		    try {
				domain.deleteGroup(req.params.id);
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

    catchAll: function(app) {

		app.post('*', function(req, resp) {
		    console.log('Unmapped request received');
		    resp.send();
		});
    },
}
