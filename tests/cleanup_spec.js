var frisby = require('frisby');
var serverConfig = require('./config');

// Cleanup
frisby.create('Get all users')
  .get(serverConfig.serverAddress + '/users')
  .addHeader('Authorization', 'Bearer ' + serverConfig.authorizationBearer)
  .afterJSON(function(data) {
    for (var i=0; i!=data.Resources.length; i++) {
      frisby.create('Delete user')
        .delete(serverConfig.serverAddress + '/users/' + data.Resources[i].id)
        .addHeader('Authorization', 'Bearer ' + serverConfig.authorizationBearer)
      .toss();
    }
  })
.toss();

frisby.create('Get all groups')
  .get(serverConfig.serverAddress + '/groups')
  .addHeader('Authorization', 'Bearer ' + serverConfig.authorizationBearer)
  .afterJSON(function(data) {
    for (var i=0; i!=data.Resources.length; i++) {
      frisby.create('Delete group')
        .delete(serverConfig.serverAddress + '/groups/' + data.Resources[i].id)
        .addHeader('Authorization', 'Bearer ' + serverConfig.authorizationBearer)
      .toss();
    }
  })
.toss();