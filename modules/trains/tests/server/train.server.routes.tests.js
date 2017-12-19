'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Train = mongoose.model('Train'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  train;

/**
 * Train routes tests
 */
describe('Train CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Train
    user.save(function () {
      train = {
        name: 'Train name'
      };

      done();
    });
  });

  it('should be able to save a Train if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Train
        agent.post('/api/trains')
          .send(train)
          .expect(200)
          .end(function (trainSaveErr, trainSaveRes) {
            // Handle Train save error
            if (trainSaveErr) {
              return done(trainSaveErr);
            }

            // Get a list of Trains
            agent.get('/api/trains')
              .end(function (trainsGetErr, trainsGetRes) {
                // Handle Trains save error
                if (trainsGetErr) {
                  return done(trainsGetErr);
                }

                // Get Trains list
                var trains = trainsGetRes.body;

                // Set assertions
                (trains[0].user._id).should.equal(userId);
                (trains[0].name).should.match('Train name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Train if not logged in', function (done) {
    agent.post('/api/trains')
      .send(train)
      .expect(403)
      .end(function (trainSaveErr, trainSaveRes) {
        // Call the assertion callback
        done(trainSaveErr);
      });
  });

  it('should not be able to save an Train if no name is provided', function (done) {
    // Invalidate name field
    train.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Train
        agent.post('/api/trains')
          .send(train)
          .expect(400)
          .end(function (trainSaveErr, trainSaveRes) {
            // Set message assertion
            (trainSaveRes.body.message).should.match('Please fill Train name');

            // Handle Train save error
            done(trainSaveErr);
          });
      });
  });

  it('should be able to update an Train if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Train
        agent.post('/api/trains')
          .send(train)
          .expect(200)
          .end(function (trainSaveErr, trainSaveRes) {
            // Handle Train save error
            if (trainSaveErr) {
              return done(trainSaveErr);
            }

            // Update Train name
            train.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Train
            agent.put('/api/trains/' + trainSaveRes.body._id)
              .send(train)
              .expect(200)
              .end(function (trainUpdateErr, trainUpdateRes) {
                // Handle Train update error
                if (trainUpdateErr) {
                  return done(trainUpdateErr);
                }

                // Set assertions
                (trainUpdateRes.body._id).should.equal(trainSaveRes.body._id);
                (trainUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Trains if not signed in', function (done) {
    // Create new Train model instance
    var trainObj = new Train(train);

    // Save the train
    trainObj.save(function () {
      // Request Trains
      request(app).get('/api/trains')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Train if not signed in', function (done) {
    // Create new Train model instance
    var trainObj = new Train(train);

    // Save the Train
    trainObj.save(function () {
      request(app).get('/api/trains/' + trainObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', train.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Train with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/trains/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Train is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Train which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Train
    request(app).get('/api/trains/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Train with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Train if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Train
        agent.post('/api/trains')
          .send(train)
          .expect(200)
          .end(function (trainSaveErr, trainSaveRes) {
            // Handle Train save error
            if (trainSaveErr) {
              return done(trainSaveErr);
            }

            // Delete an existing Train
            agent.delete('/api/trains/' + trainSaveRes.body._id)
              .send(train)
              .expect(200)
              .end(function (trainDeleteErr, trainDeleteRes) {
                // Handle train error error
                if (trainDeleteErr) {
                  return done(trainDeleteErr);
                }

                // Set assertions
                (trainDeleteRes.body._id).should.equal(trainSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Train if not signed in', function (done) {
    // Set Train user
    train.user = user;

    // Create new Train model instance
    var trainObj = new Train(train);

    // Save the Train
    trainObj.save(function () {
      // Try deleting Train
      request(app).delete('/api/trains/' + trainObj._id)
        .expect(403)
        .end(function (trainDeleteErr, trainDeleteRes) {
          // Set message assertion
          (trainDeleteRes.body.message).should.match('User is not authorized');

          // Handle Train error error
          done(trainDeleteErr);
        });

    });
  });

  it('should be able to get a single Train that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Train
          agent.post('/api/trains')
            .send(train)
            .expect(200)
            .end(function (trainSaveErr, trainSaveRes) {
              // Handle Train save error
              if (trainSaveErr) {
                return done(trainSaveErr);
              }

              // Set assertions on new Train
              (trainSaveRes.body.name).should.equal(train.name);
              should.exist(trainSaveRes.body.user);
              should.equal(trainSaveRes.body.user._id, orphanId);

              // force the Train to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Train
                    agent.get('/api/trains/' + trainSaveRes.body._id)
                      .expect(200)
                      .end(function (trainInfoErr, trainInfoRes) {
                        // Handle Train error
                        if (trainInfoErr) {
                          return done(trainInfoErr);
                        }

                        // Set assertions
                        (trainInfoRes.body._id).should.equal(trainSaveRes.body._id);
                        (trainInfoRes.body.name).should.equal(train.name);
                        should.equal(trainInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Train.remove().exec(done);
    });
  });
});
