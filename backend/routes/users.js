var express = require('express');
var router = express.Router();
let bcrypt = require('bcrypt');
let User = require('../models/user');
let uid = require('uid2');
const cost = 10;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ result: false, error: 'Please use a correct route.' });
});

router.post('/sign-up', async (req, res) => {
  if (!req.body.email || !req.body.username || !req.body.password) {
    return res.json({ result: false, error: 'Input is missing.' })
  }
  // search if user already exists
  let alreadyUser = await User.findOne({ email: req.body.email });
  if (alreadyUser) {
    return res.json({ result: false, error: "L'utilisateur existe déjà" })
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

router.post('/edit-profile', async (req, res) => {
  if (!req.body.token) {
    return res.json({ result: false, error: 'Token manquant.' })
  }
  // search user in db by token
  let foundUser = await User.findOne({ token: req.body.token });
  if (!foundUser) {
    return res.json({ result: false, error: 'Mauvais token.' })
  }
  console.log(JSON.stringify(req.body));
  if (typeof req.body.name !== 'string' || typeof req.body.lastname !== 'string' || typeof req.body.age !== 'string') {
    return res.json({ result: false, error: 'Mauvais type de données.' })
  }
  let age = req.body.age
  if (!age) {
    age = -1
  } else {
    age = parseInt(age)
  }
  let name = req.body.name.toString();
  let lastname = req.body.lastname.toString();
  foundUser.name = name;
  foundUser.lastname = lastname;
  foundUser.age = age;
  let savedUser = await foundUser.save();
  if (savedUser) {
    return res.json({ result: true, user: savedUser })
  }
  return res.json({ result: false, error: 'Erreur lors de la sauvegarde.', user: foundUser })
})

router.get('/search-people', async (req, res) => {
  if (!req.query.username) {
    return res.json({ result: false, error: 'Username is missing.' });
  }
  let foundUsers = await User.find({ username: req.query.username }).populate('tracks').exec();
  let cleanUsers = [];
  foundUsers.forEach(user => {
    cleanUsers.push({
      _id: user._id,
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      age: user.age,
      averageRating: user.averageRating,
      createdAccount: user.createdAccount,
      tracks: user.tracks,
      age: user.age,
      friends: user.friends
    })
  })
  return res.json({ result: true, users: cleanUsers });
});

router.post('/add-friend', async (req, res) => {
  if (!req.body.token || !req.body.username) {
    return res.json({ result: false, error: 'Token or username is missing.' });
  }
  let foundUser = await User.findOne({ token: req.body.token });
  if (!foundUser) {
    return res.json({ result: false, error: 'User token not found.' });
  }
  let foundFriend = await User.findOne({ username: req.body.username });
  if (!foundFriend) {
    return res.json({ result: false, error: 'User to friend not found.' });
  }
  // check if not already friends
  if (foundUser.friends.includes(foundFriend._id)) {
    return res.json({ result: false, error: 'Vous etes déjà amis.' });
  }

  foundUser.friends.push(foundFriend._id);
  await foundUser.save();
  return res.json({ result: true, user: foundUser });
});

router.get('/user/:id', async (req, res) => {
  console.log(req.params.id)
  if (!req.params.id) {
    return res.json({ result: false, error: 'Id est manquant.' });
  }
  let foundUser = await User.findById(req.params.id).populate('tracks').exec();
  if (!foundUser) {
    return res.json({ result: false, error: 'User not found by id.' });
  }
  let cleanUser = {
    _id: foundUser._id,
    username: foundUser.username,
    name: foundUser.name,
    lastname: foundUser.lastname,
    age: foundUser.age,
    averageRating: foundUser.averageRating,
    createdAccount: foundUser.createdAccount,
    tracks: foundUser.tracks,
    friends: foundUser.friends
  }
  return res.json({ result: true, user: cleanUser });
});



router.post('/update-rating', async (req, res) => {
  console.log(req.body)
  let foundUser = await User.findOne({ _id: req.body.id });
  if (!foundUser) {
    return res.json({ result: false, error: 'User is missing.' });
  }
  foundUser.averageRating = req.body.averageRating
  let savedUser = await foundUser.save();

  if (savedUser) {
    return res.json({ result: true, user: savedUser })
  }
});


module.exports = router;
