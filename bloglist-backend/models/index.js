const User = require('./user');
const Blog = require('./blog');
const UserBlogs = require('./user_blogs');

Blog.belongsTo(User);
User.hasMany(Blog);

User.belongsToMany(Blog, { through: UserBlogs, as: 'readings' });
Blog.belongsToMany(User, { through: UserBlogs, as: 'users_marked' });

module.exports = {
  Blog, User, UserBlogs
};
