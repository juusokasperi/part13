const User = require('./user');
const Blog = require('./blog');

User.hasMany(Blog);
Blog.belongsTo(User);

const initializeDatabase = async() => {
  await User.sync({ alter: true });
  await Blog.sync({ alter: true });
};

initializeDatabase();

module.exports = {
  Blog, User
};
