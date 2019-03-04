const db = require('../db');

const Posts = db.sequelize.define('Posts', {
  title: db.Sequelize.STRING,
  body: db.Sequelize.TEXT,
  user: db.Sequelize.INTEGER
});

Posts.user = Posts.belongsTo(db.sequelize.models.Users, {foreignKey: 'user'});

Posts.serialize = function(post) {
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    date: post.createdAt, 
    user: {
      displayName: post.User.displayName,
      username: post.User.username,
      role: post.User.Role.name
    }
  };
};

Posts.serializePosts = (posts) => {
  let newPosts = [];
  posts.forEach(post => {
    newPosts.push(Posts.serialize(post));
  });
  return newPosts;
};

Posts.getFullPost = (id) => {
  return db.sequelize.models.Posts.find({
    where: {
        id: Number(id)
    },
    include:[{
        model: db.sequelize.models.Users,
        required: true,
        include: [{
            model: db.sequelize.models.Roles,
            required: true
        }]
    }]
  })
}

module.exports = Posts;