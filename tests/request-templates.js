// -----------------------------------------------------------------------------
// Sample requests from https://developers.onelogin.com/scim/implement-scim-api
// -----------------------------------------------------------------------------
module.exports = {

	getCreateUserRequest: function() {
		return {
		   "schemas":[
		      "urn:scim:schemas:core:1.0"
		   ],
		   "externalId":null,
		   "userName":"jbibinka2@example.com",
		   "nickName":"Bibi2",
		   "name":{
		      "givenName":"Justin",
		      "familyName":"Bibinka"
		   },
		   "displayName":"jbibinka",
		   "profileUrl":"https://example.app.com/team/justin",
		   "title":"Director of Sanging",
		   "timezone":"Pacific Standard Time",
		   "active":true,
		   "emails":[
		      {
		         "value":"jbibinka2@example.com",
		         "primary":true
		      }
		   ],
		   "photos":[
		      {
		         "value":"https://secure.gravatar.com/avatar/506c1f645ad2266f2353a50230c52f84.jpg",
		         "type":"photo"
		      }
		   ],
		   "groups":[

		   ]
		};
	},

	getUpdateUserRequest: function() {
		return this.getCreateUserRequest();
	},

	getCreateGroupRequest: function() {
		return {
		   "schemas":[
		      "urn:scim:schemas:core:1.0"
		   ],
		   "displayName":"Contractors",
		   "members":[

		   ]
		}
	},

	getPatchGroupRequest: function(memberToBeAdded, isDelete) {
		var result = {
		   "schemas":[
		      "urn:scim:schemas:core:1.0"
		   ],
		   "members":[
		      {
		         "value": memberToBeAdded
		      }
		   ]
		}

		if (isDelete) {
			result.members[0].operation = 'delete';
		}

		return result;
	}
}