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
  if (blog)
    return res.json(blog);
  else
    return res.status(404).end();
});

router.delete('/:id', async (request, response) => {
  const deletedRows = await Blog.destroy({ where: { id: request.params.id } });
  if (deletedRows)
    return response.status(204).end();
  else
    return response.status(404).json({ error: `Blog id '${request.params.id}' not found` });
});

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  blog.likes = req.body.likes;
  await blog.save();
  return res.json(blog);
});

module.exports = router;
