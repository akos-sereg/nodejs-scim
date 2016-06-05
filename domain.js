module.exports = {

	users: [],
	groups: [],
	newUserId: 1,
	newGroupId: 1,

	getUsers: function() {
		return this.users;
	},

	getGroups: function() {
		return this.groups;
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
			    this.users[i] = userData;
			}
	    }
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