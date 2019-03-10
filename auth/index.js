const jwt = require('express-jwt');
const JWT = require('jsonwebtoken');
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
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    credentialsRequired: false,
    getToken: getTokenFromHeader
  }),
  verify: function(token) {
    try {
      return JWT.verify(token,secret);;
    } catch(err) {
      return false;
    }
  }
};

module.exports = auth;
