'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Trains Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/trains',
      permissions: '*'
    }, {
      resources: '/api/trains/:trainId',
      permissions: '*'
    }]
  }, {
    roles: ['commuter'],
    allows: [{
      resources: '/api/trains',
      permissions: ['get', 'post']
    }, {
      resources: '/api/trains/:trainId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/trains',
      permissions: ['get']
    }, {
      resources: '/api/trains/:trainId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Trains Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Train is being processed and the current user created it then allow any manipulation
  if (req.train && req.user && req.train.user && req.train.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
