var frisby = require('frisby');

// System under test
var scimServerEndpoint = 'http://192.168.1.112:3000/svc/scim';
var authorizationBearer = 'alma';

// Cleanup
frisby.create('Get all users')
  .get(scimServerEndpoint + '/users')
  .addHeader('Authorization', 'Bearer ' + authorizationBearer)
  .afterJSON(function(data) {
    for (var i=0; i!=data.Resources.length; i++) {
      frisby.create('Delete user')
        .delete(scimServerEndpoint + '/users/' + data.Resources[i].id)
        .addHeader('Authorization', 'Bearer ' + authorizationBearer)
      .toss();
    }
  })
.toss();

frisby.create('Get all groups')
  .get(scimServerEndpoint + '/groups')
  .addHeader('Authorization', 'Bearer ' + authorizationBearer)
  .afterJSON(function(data) {
    for (var i=0; i!=data.Resources.length; i++) {
      frisby.create('Delete group')
        .delete(scimServerEndpoint + '/groups/' + data.Resources[i].id)
        .addHeader('Authorization', 'Bearer ' + authorizationBearer)
      .toss();
    }
  })
.toss();