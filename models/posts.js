const db = require('../db');

const Posts = db.sequelize.define('Posts', {
  title: db.Sequelize.STRING,
  body: db.Sequelize.TEXT,
  user: db.Sequelize.INTEGER
});

Posts.user = Posts.belongsTo(db.sequelize.models.Users, {foreignKey: 'user'});

Posts.prototype.serialize = async function() {
  return this.getUser().then(user => {
    return {
      id: this.id,
      title: this.title,
      body: this.body,
      user: {
        displayName: user.displayName,
        role: user.role,
        username: user.username
      },
      date: this.createdAt
    };
  });
};

Posts.serializePosts = (posts) => {
  let newPosts = [];
  posts.forEach(post => {
    newPosts.push({
      id: post.id,
      title: post.title,
      body: post.body,
      date: post.createdAt, 
      user: {
        displayName: post.User.displayName,
        username: post.User.username,
        role: post.User.Role.name
      }
    });
  });
  return newPosts;
};

module.exports = Posts;