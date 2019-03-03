const db = require('../db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').jwtSecret;

const usersObj = {
  id: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  username: { type: db.Sequelize.STRING(20), allowNull: false, unique: true },
  displayName: db.Sequelize.STRING(30),
  salt: { type: db.Sequelize.TEXT, allowNull: false },
  hash: { type: db.Sequelize.TEXT, allowNull: false }
};

const Users = db.sequelize.define('Users', usersObj);
Users.role = Users.belongsTo(db.sequelize.models.Roles, {foreignKey: 'role'});

Users.encryptUserPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
  return {
      salt: salt,
      hash: hash
  };
};
Users.prototype.isCorrectPassword = function(plain) {
    const encrypted = crypto.pbkdf2Sync(plain, this.salt, 10000, 512, 'sha512').toString('hex');
    return encrypted === this.hash;
};
Users.prototype.generateJWT = function() {
  let exp = new Date();
  exp.setDate(new Date().getDate() + 60);

  return jwt.sign({
    id: this.id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
}
Users.prototype.serialize = async function() {
  const role = await this.getRole();
  return {
    username: this.username,
    displayName: this.displayName,
    role: role.name
  }
}

module.exports = Users;