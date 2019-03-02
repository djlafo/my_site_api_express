'use strict';

const db = require('../db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').jwtSecret;

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    username: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    displayName: DataTypes.STRING(30),
    salt: { type: DataTypes.TEXT, allowNull: false },
    hash: { type: DataTypes.TEXT, allowNull: false }
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };

  Users.encryptPassword = function(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return {
        salt: salt,
        hash: hash
    };
  };
  Users.isCorrectPassword = function(plain, salt, hash) {
      const encrypted = crypto.pbkdf2Sync(plain, salt, 10000, 512, 'sha512').toString('hex');
      return encrypted === hash;
  };
  Users.generateUserJWT = function(user) {
    let exp = new Date();
    exp.setDate(new Date().getDate() + 60);
  
    return jwt.sign({
      id: user.id,
      username: user.username,
      exp: parseInt(exp.getTime() / 1000),
    }, secret);
  }
  Users.serializeUser = function(user) {
    return {
      username: user.username,
      displayName: user.displayName
    }
  }
  return Users;
};