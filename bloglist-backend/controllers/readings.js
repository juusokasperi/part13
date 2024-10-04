const router = require('express').Router();
const { UserBlogs } = require('../models');
const middleware = require('../util/middleware');

// eslint-disable-next-line no-unused-vars
router.post('/', async (req, res) => {
  const blog = await UserBlogs.create(req.body);
  return res.json(blog);
});

router.put('/:id', middleware.userExtractor, async (req, res) => {
  const reading = await UserBlogs.findByPk(req.params.id);
  if (!reading)
    throw Error('invalid reading');
  if (req.user.id !== reading.userId)
    return res.status(401).json({ error: 'user not authorized to modify this reading' });
  reading.read = req.body.read;
  await reading.save();
  return res.json(reading);
});

module.exports = router;
