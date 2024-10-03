const express = require('express');
require('express-async-errors');
const logger = require('./util/logger');
const middleware = require('./util/middleware');
const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');

const app = express();
app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

const start = async() => {
  await connectToDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on ${PORT}`);
  });
};

start();
