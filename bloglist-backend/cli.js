require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
  try {
    const blogs = await sequelize.query('SELECT * from blogs', { type:
      QueryTypes.SELECT });
    blogs.map((blog) => {
      if (blog.author) {
        console.log(`${blog.author}: \'${blog.title}\', ${blog.likes} likes`);
      } else {
        console.log(`\'${blog.title}\', ${blog.likes} likes`);
      }
    });
    sequelize.close();
  } catch (error) {
    console.error('Unable to fetch blogs:', error);
  }
};

main();
