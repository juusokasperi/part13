const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const middleware = require('../util/middleware');

const { SECRET } = require('../util/config');
const { User, Session } = require('../models/');

router.post('/', async(req, res) => {
  const body = req.body;
  if (!body.username || !body.password)
    return res.status(401).json({ error: 'missing username or password' });
  const user = await User.scope('getAll').findOne({
    where: { username: body.username } });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect))
    return res.status(401).json({ error: 'invalid username or password' });
  if (user.disabled)
    return res.status(401).json({ error: 'account disabled, contact admin'});

  const userForToken = {
    username: user.username,
    id: user.id
  };
  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60*60 });
  await Session.create({ userId: user.id, token });
  res.status(200).send({ token, username: user.username, name: user.name });
});

router.delete('/', middleware.userExtractor, async(req, res) => {
  await Session.destroy({ where: { token: req.token } });
  res.status(204).end();
});

module.exports = router;
