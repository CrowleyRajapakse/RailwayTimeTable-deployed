'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Train = mongoose.model('Train'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Train
 */
exports.create = function(req, res) {
  var train = new Train(req.body);
  train.user = req.user;

  train.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(train);
    }
  });
};

/**
 * Show the current Train
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var train = req.train ? req.train.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  train.isCurrentUserOwner = req.user && train.user && train.user._id.toString() === req.user._id.toString();

  res.jsonp(train);
};

/**
 * Update a Train
 */
exports.update = function(req, res) {
  var train = req.train;

  train = _.extend(train, req.body);

  train.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(train);
    }
  });
};

/**
 * Delete an Train
 */
exports.delete = function(req, res) {
  var train = req.train;

  train.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(train);
    }
  });
};

/**
 * List of Trains
 */
exports.list = function(req, res) {
  Train.find().sort('-created').populate('user', 'displayName').exec(function(err, trains) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trains);
    }
  });
};

/**
 * Train middleware
 */
exports.trainByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Train is invalid'
    });
  }

  Train.findById(id).populate('user', 'displayName').exec(function (err, train) {
    if (err) {
      return next(err);
    } else if (!train) {
      return res.status(404).send({
        message: 'No Train with that identifier has been found'
      });
    }
    req.train = train;
    next();
  });
};
