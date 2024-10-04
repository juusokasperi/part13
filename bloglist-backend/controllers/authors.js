const router = require('express').Router();
const { Blog } = require('../models');
const { fn, col } = require('sequelize');

// eslint-disable-next-line no-unused-vars
router.get('/', async(req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('id')), 'articles'],
      [fn('SUM', col('likes')), 'likes']
    ],
    group: ['author'],
    order: [['likes', 'DESC']]
  });
  return res.json(authors);
});

module.exports = router;
