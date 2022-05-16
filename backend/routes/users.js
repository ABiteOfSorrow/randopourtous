var express = require('express');
var router = express.Router();
let bcrypt = require('bcrypt');
let User = require('../models/user');
let uid = require('uid2');
const cost = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-up', async (req, res) => {
  if (!req.body.email || !req.body.username || !req.body.password) {
    return res.json({ result: false, error: 'Input is missing.' })
  }
  const hash = bcrypt.hashSync(req.body.password, cost);
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hash,
    name: '',
    lastname: '',
    averageRating: -1,
    createdAccount: new Date(),
    token: uid(32),
    tracks: []
  });
  let savedUser = await user.save();
  if (savedUser) {
    return res.json({ result: true, user: savedUser })
  }
  return res.json({ result: false, error: 'Error while saving user.' })
});

router.post('/sign-in', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.json({ result: false, error: 'Il manque les données.' })
  }
  let foundUser = await User.findOne({ email: req.body.email })
  if (!foundUser) {
    return res.json({ result: false, error: 'Utilisateur inexistant.' })
  }
  if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
    return res.json({ result: false, error: 'Wrong password.' })
  }
  return res.json({ result: true, user: foundUser })
});

module.exports = router;
