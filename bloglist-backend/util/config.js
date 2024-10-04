require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.port || 3001,
  SECRET: process.env.SECRET,
};
