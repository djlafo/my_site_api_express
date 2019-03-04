const db = require('../db');

const Posts = db.sequelize.define('Posts', {
  title: db.Sequelize.STRING,
  body: db.Sequelize.TEXT,
  user: db.Sequelize.INTEGER
});

Posts.user = Posts.belongsTo(db.sequelize.models.Users, {foreignKey: 'user'});

Posts.prototype.serialize = function() {
  return {
    id: this.id,
    title: this.title,
    body: this.body,
    date: this.createdAt, 
    user: {
      displayName: this.User.displayName,
      username: this.User.username,
      role: this.User.Role.name
    }
  };
};

Posts.serializePosts = (posts) => {
  let newPosts = [];
  posts.forEach(post => {
    newPosts.push(post.serialize());
  });
  return newPosts;
};

module.exports = Posts;