const router = require('express').Router();
const { Blog, User } = require('../models');
const middleware = require('../util/middleware');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  let where = {};
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: { [Op.iLike]: `%${req.query.search}%` }
        },
        {
          author: { [Op.iLike]: `%${req.query.search}%` }
        }
      ]
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    order: [
      ['likes', 'DESC'],
    ],
    where
  });
  return res.json(blogs);
});

router.post('/', middleware.userExtractor, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  return res.json(blog);
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog)
    throw Error('invalid blog id');
  return res.json(blog);
});

router.delete('/:id', middleware.userExtractor, async (req, res) => {
  const blogToDelete = await Blog.findByPk(req.params.id);
  if (!blogToDelete)
    throw Error('invalid blog id');
  if (req.user.id !== blogToDelete.userId)
    throw Error('not authorized');
  await blogToDelete.destroy();
  return res.status(204).end();
});

router.put('/:id', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog)
    throw Error('invalid blog id');
  if (req.user.id !== blog.userId)
    throw Error('not authorized');
  blog.likes = req.body.likes;
  await blog.save();
  return res.json(blog);
});

module.exports = router;
