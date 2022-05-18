var express = require('express');
var router = express.Router();
var randoModel = require('../models/rando');
let UserModel = require('../models/user');

var uid2 = require('uid2');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/create-track', async function (req, res, next) {
  // console.log(JSON.stringify(req.body))
  var randoData = req.body
  let estimation_time = randoData.estimation_time;
  let description = randoData.description;
  if (!description) {
    description = '';
  }
  if (!estimation_time) {
    estimation_time = 0;
  } else {
    estimation_time = parseInt(estimation_time)
  }
  let token = req.body.token;
  if (!token) {
    return res.json({ result: false, error: 'Token manquant.' })
  }
  if ( !randoData.userToken, !randoData.name, !randoData.coordinate, !randoData.date ) {
    return res.json({ result: false, error: 'Inputs incorrects' })
  }

  let foundUser = await UserModel.findOne({ token });
  if(!foundUser) {
    return res.json({ result: false, error: 'Mauvais token' })
  }
  let user = { _id: foundUser._id, username: foundUser.username, name: foundUser.name, lastname: foundUser.lastname }

  let users = []
  users.push(user)
  //    console.log(JSON.stringify(randoData))
  var newRando = new randoModel({
    mixed: randoData.mixed,
    userId: foundUser.id,
    name: randoData.name,
    city: randoData.departure,
    coordinate: randoData.coordinate,
    maxUsers: parseInt(randoData.maxRunner),
    users,
    date: new Date(randoData.date),
    estimation_time: estimation_time,
    description: randoData.description,
    level: randoData.level,
  });
  console.log('rando save');
  var randoSaved = await newRando.save();
  console.log(randoSaved)

  return res.json({ result: true })
});

module.exports = router;
