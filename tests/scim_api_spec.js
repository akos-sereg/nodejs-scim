var frisby = require('frisby');
var requestTemplates = require('./request-templates');

// System under test
var scimServerEndpoint = 'http://192.168.1.112:3000/svc/scim';

/* ***************************************************** */
/* User handling                                         */
/* ***************************************************** */

// Create user
frisby.create('Ensure create user returns 201 Created')
  .post(scimServerEndpoint + '/users', requestTemplates.getCreateUserRequest(), { json: true })
  .expectStatus(201)
  .after(function(err, res, body) {

    var createdUser = body;

    // Get user
    frisby.create('Get newly created user')
      .get(scimServerEndpoint + '/users/' + createdUser.id)
      .expectStatus(200)
      .afterJSON(function(json) {
        describe('Created user', function() {
          it('has correct userName', function() { expect(json.userName).toBe('jbibinka2@example.com'); });
          it('has correct nickName', function() { expect(json.nickName).toBe('Bibi2'); });
          it('has correct given name', function() { expect(json.name.givenName).toBe('Justin'); });
          it('has correct family name', function() { expect(json.name.familyName).toBe('Bibinka'); });
        });
      })
    .toss();

    // Update user
    createdUser.userName = 'modified@username.com';
    frisby.create('Update user')
      .put(scimServerEndpoint + '/users/' + createdUser.id, createdUser, { json: true })
      .expectStatus(200)
      .afterJSON(function(json) {
        describe('Updated user', function() {
          it('has correct userName', function() { expect(json.userName).toBe('modified@username.com'); });
        });
      })
    .toss();

    // Delete user
    frisby.create('Delete user')
      .delete(scimServerEndpoint + '/users/' + createdUser.id)
      .expectStatus(200)
      .after(function(err, res, body) {
        frisby.create('Get "deleted" user').get(scimServerEndpoint + '/users/' + createdUser.id).expectStatus(404).toss();
      })
    .toss();
  })
.toss()

/* ***************************************************** */
/* Group handling                                        */
/* ***************************************************** */

// Create group
frisby.create('Ensure create group returns 201 Created')
  .post(scimServerEndpoint + '/groups', requestTemplates.getCreateGroupRequest(), { json: true })
  .expectStatus(201)
  .after(function(err, res, body) {
    var createdGroup = body;

    // Get groups, newly created group should be there
    frisby.create('Get newly created group')
      .get(scimServerEndpoint + '/groups')
      .expectStatus(200)
      .afterJSON(function(json) {

        var groups = json.Resources;
        var newlyCreatedGroup = null;
        for (var i=0; i!=groups.length; i++) {
          if (createdGroup.id == groups[i].id) {
            newlyCreatedGroup = groups[i];
            break;
          }
        }

        describe('Created group', function() {
          it('has the newly created group', function() { expect(newlyCreatedGroup).not.toBe(null); });
          it('has correct displayName', function() { expect(newlyCreatedGroup.displayName).toBe('Contractors'); });
        });
      })
    .toss();

    // Update group (adding member)
    frisby.create('Create user that can be added to group')
      .post(scimServerEndpoint + '/users', requestTemplates.getCreateUserRequest(), { json: true })
      .expectStatus(201)
      .after(function(err, res, body) {
        var createdUser = body;
        var patchGroupRequest = requestTemplates.getPatchGroupRequest(createdUser.id, false);

        // Update group - Add member
        frisby.create('Update group (add member)')
          .patch(scimServerEndpoint + '/groups/' + createdGroup.id, patchGroupRequest, { json: true })
          .expectStatus(200)
          .after(function(err, res, body) {
            
            // Validate that createdUser should be a member of the group by now
            frisby.create('Get updated group')
              .get(scimServerEndpoint + '/groups')
              .expectStatus(200)
              .afterJSON(function(json) {

                var groups = json.Resources;
                var updatedGroup = null;
                for (var i=0; i!=groups.length; i++) {
                  if (createdGroup.id == groups[i].id) {
                    updatedGroup = groups[i];
                    break;
                  }
                }

                describe('Updated group', function() {
                  it('is listed', function() { expect(updatedGroup).not.toBe(null); });
                  it('has members ', function() { expect(updatedGroup.members).not.toBe(null); });
                });

                var memberFound = false;
                
                for (var i=0; i!=updatedGroup.members.length; i++) {
                  if (updatedGroup.members[i].value == createdUser.id) {
                    memberFound = true;
                  }
                }

                describe('Updated group', function() {
                  it('has new member', function() { expect(memberFound).toBe(true); });
                });


                // Remove from group
                patchGroupRequest = requestTemplates.getPatchGroupRequest(createdUser.id, true);
                frisby.create('Update group (add member)')
                  .patch(scimServerEndpoint + '/groups/' + createdGroup.id, patchGroupRequest, { json: true })
                  .expectStatus(200)
                  .after(function(err, res, body) {
                    
                    // Validate that createdUser should not be a member of the group by now
                    frisby.create('Get updated group')
                      .get(scimServerEndpoint + '/groups')
                      .expectStatus(200)
                      .afterJSON(function(json) {

                        var groups = json.Resources;
                        var updatedGroup = null;
                        for (var i=0; i!=groups.length; i++) {
                          if (createdGroup.id == groups[i].id) {
                            updatedGroup = groups[i];
                            break;
                          }
                        }

                        describe('Updated group', function() {
                          it('is listed', function() { expect(updatedGroup).not.toBe(null); });
                          it('has members ', function() { expect(updatedGroup.members).not.toBe(null); });
                        });

                        var memberFound = false;
                        
                        for (var i=0; i!=updatedGroup.members.length; i++) {
                          if (updatedGroup.members[i].value == createdUser.id) {
                            memberFound = true;
                          }
                        }

                        describe('Updated group', function() {
                          it('does not include member', function() { expect(memberFound).toBe(false); });
                        });
                      })
                    .toss();
                  })
                .toss();
                // End of "Remove from group"

              })
            .toss();
          })
        .toss();
      })
    .toss();

  })
.toss()