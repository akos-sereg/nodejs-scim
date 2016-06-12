module.exports = {

	users: [],
	groups: [],
	newUserId: 1,
	newGroupId: 1,

	getUsers: function(startIndex) {

		if (!startIndex) {
			return this.users;
		}

		if (startIndex > this.users.length) {
			return [];
		}

		var result = [];
	
		for (var i=startIndex-1; i!=this.users.length; i++) {
			result.push(this.users[i]);
		}

		return result;
	},

	getGroups: function(startIndex) {

		if (!startIndex) {
			return this.groups;
		}

		if (startIndex > this.groups.length) {
			return [];
		}

		var result = [];


		for (var i=startIndex-1; i!=this.groups.length; i++) {
			result.push(this.groups[i]);
		}

		return result;
	},

	addUser: function(user) {
		user.id = this.newUserId++;
		this.users.push(user);
	},

	addGroup: function(group) {
		group.id = this.newGroupId++;
		this.groups.push(group);
	},

	updateUser: function(userId, userData) {
		for (var i=0; i!=this.users.length; i++) {
			if (this.users[i].id == userId) {
			    if(!userData.id) {
					userData.id = userId;
			    }

			    this.users[i] = userData;
			}
	    }
	},

	deleteUserById: function(userId) {

		// Check if user is member of a group
		var groupIds = [];
		for (var i=0; i!=this.groups.length; i++) {
			if (this.groups[i].members != undefined) {
				for (var j=0; j!=this.groups[i].members.length; j++) {
					if (this.groups[i].members[j].value == userId) {
						groupIds.push(this.groups[i].id);	
					}
				}
			}
		}	

		for (var i=0; i!=groupIds.length; i++) {
			console.log('\t[domain] Removing user from Group: ' + groupIds[i]);
			this.removeUserFromGroup(groupIds[i], userId);
		}

		// Remove user from users
		var users = [];
		for (var i=0; i!=this.users.length; i++) {
			if (this.users[i].id != userId) {
				users.push(this.users[i]);
			}
		}

		this.users = users;

	},

	removeUserFromGroup: function(groupId, userId) {

	    var members = [];
	    var group = this.getGroupById(groupId);

	    for (var i=0; i!=group.members.length; i++) {
			if (userId != group.members[i].value) {
			    members.add(group.members[i]);
			}
	    }

	    group.members = members;
	},

	addUserToGroup: function(groupId, userId) {

	    this.removeUserFromGroup(groupId, userId);

	    var user = this.getUserById(userId);
	    var group = this.getGroupById(groupId);

	    if (group.members == undefined) {
	    	group.members = [];
	    }

	    group.members.push({ 
			value: user.id, 
			display: user.userName 
	    });
	},

	getGroupById: function(groupId) {
	    for (var i=0; i!=this.groups.length; i++) {
			if (this.groups[i].id == groupId) {
			    return this.groups[i];
			}
	    }

	    return null;
	},

	getUserById: function(userId) {
	    for (var i=0; i!=this.users.length; i++) {
			if (this.users[i].id == userId) {
			    return this.users[i];
			}
	    }

	    return null;
	},

	manageMembers: function(groupId, members) {

		var group = this.getGroupById(groupId);
	    
	    if (group == null) {
			throw new Error('Group not found');
	    }

	    if (group.members == undefined) {
	    	group.members = [];
	    }

	    for (var i=0; i!= members.length; i++) {
		
			if (members[i].operation && members[i].operation == 'delete') {
			    this.removeUserFromGroup(groupId, members[i].value);
			}
			else {
			    this.addUserToGroup(groupId, members[i].value);
			}
	    }
	}
}
