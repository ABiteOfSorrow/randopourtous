var express = require('express');
var router = express.Router();
let bcrypt = require('bcrypt');
let User = require('../models/user');
let uid = require('uid2');
const cost = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({ result: false, error: 'Please use a correct route.' });
});

router.post('/sign-up', async (req, res) => {
  if (!req.body.email || !req.body.username || !req.body.password) {
    return res.json({ result: false, error: 'Input is missing.' })
  }
  // search if user already exists
  let alreadyUser = await User.findOne({ email: req.body.email });
  if (alreadyUser) {
    return res.json({ result: false, error: 'User already exists.' })
  }
  const hash = bcrypt.hashSync(req.body.password, cost);
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hash,
    name: '',
    lastname: '',
    averageRating: -1,
    age: -1,
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

router.get('/my-data', async (req, res) => {
  if (!req.query.token) {
    return res.json({ result: false, error: 'Token is missing.' })
  }
  // search user in db by token
  let foundUser = await User.findOne({ token: req.query.token });
  if (!foundUser) {
    return res.json({ result: false, error: 'User not found.' })
  }
  return res.json({ result: true, user: foundUser })
});

module.exports = router;
