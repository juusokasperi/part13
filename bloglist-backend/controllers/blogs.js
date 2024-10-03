const router = require('express').Router();
const { Blog } = require('../models');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  return res.json(blogs);
});

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body);
  return res.json(blog);
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog)
    throw Error('invalid id');
  return res.json(blog);
});

router.delete('/:id', async (req, res) => {
  const deletedRows = await Blog.destroy({ where: { id: req.params.id } });
  if (!deletedRows)
    throw Error('invalid id');
  return res.status(204).end();
});

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog)
    throw Error('invalid id');
  blog.likes = req.body.likes;
  await blog.save();
  return res.json(blog);
});

module.exports = router;
