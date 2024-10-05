const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, Blog } = require('../models');
const middleware = require('../util/middleware');

router.get('/', async(req, res) => {
  const users = await User.scope('withoutPassword').findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  });
  return res.json(users);
});

router.post('/', async(req, res) => {
  const { username, name, password } = req.body;
  if (password === undefined) {
    return res.status(400).json({ error: 'password is missing' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, name, passwordHash });
  return res.status(201).json(user);
});

router.get('/:id', async(req, res) => {
  const user = await User.scope('withoutPassword').findByPk(req.params.id, {
    include: [{
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: ['id', 'read'],
        as: 'readinglists',
        where: req.query.read ? {
          read: req.query.read === 'true'
        } : undefined
      },
    }],
  });
  return res.json(user);
});

router.put('/:username', middleware.userExtractor, async (req, res) => {
  const user = await User.scope('withoutPassword').findOne({
    where: { username: req.params.username } });
  if (!user)
    throw Error('invalid user');
  if (user.username !== req.params.username)
    throw Error('not authorized');
  user.username = req.body.username;
  await user.save();
  return res.json(user);
});

module.exports = router;
