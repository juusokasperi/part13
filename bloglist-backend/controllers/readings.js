const router = require('express').Router();
const { Blog, UserBlogs } = require('../models');
const middleware = require('../util/middleware');

// eslint-disable-next-line no-unused-vars
router.post('/', middleware.userExtractor, async (req, res) => {
  const { blogId, userId } = req.body;
  if (req.user.id !== userId)
    throw Error('not authorized');
  if (!(await Blog.findByPk(blogId)))
    return res.status(404).json({ error: 'blog not found' });
  if (await UserBlogs.findOne({ where: { userId, blogId } }))
    return res.status(400).json({ error: 'blog already in reading list' });
  const reading = await UserBlogs.create(req.body);
  return res.json(reading);
});

router.put('/:id', middleware.userExtractor, async (req, res) => {
  const reading = await UserBlogs.findByPk(req.params.id);
  if (!reading)
    throw Error('invalid reading');
  if (req.user.id !== reading.userId)
    throw Error('not authorized');
  reading.read = req.body.read;
  await reading.save();
  return res.json(reading);
});

module.exports = router;
