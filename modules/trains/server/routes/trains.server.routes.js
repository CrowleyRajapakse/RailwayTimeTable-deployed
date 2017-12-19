'use strict';

/**
 * Module dependencies
 */
var trainsPolicy = require('../policies/trains.server.policy'),
  trains = require('../controllers/trains.server.controller');

module.exports = function(app) {
  // Trains Routes
  app.route('/api/trains').all(trainsPolicy.isAllowed)
    .get(trains.list)
    .post(trains.create);

  app.route('/api/trains/:trainId').all(trainsPolicy.isAllowed)
    .get(trains.read)
    .put(trains.update)
    .delete(trains.delete);

  // Finish by binding the Train middleware
  app.param('trainId', trains.trainByID);
};
