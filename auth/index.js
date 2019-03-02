const jwt = require('express-jwt');
const secret = require('../config').jwtSecret;

const getTokenFromHeader = function(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

const auth = {
  required: jwt({
    secret: secret,
    userProperty: 'user',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'user',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
