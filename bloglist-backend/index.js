const express = require('express');
require('express-async-errors');
const app = express();
const logger = require('./util/logger');
const middleware = require('./util/middleware');
const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');

app.use(express.json());
app.use('/api/blogs', blogsRouter);

const start = async() => {
  await connectToDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on ${PORT}`);
  });
};

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

start();
