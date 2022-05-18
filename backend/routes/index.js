var express = require('express');
var router = express.Router();
var randoModel = require('../models/rando');

var uid2 = require('uid2');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/create-track', async function (req, res, next) {
  // console.log(JSON.stringify(req.body))
  var randoData = req.body
  let estimation_time = randoData.estim_time;
  let description = randoData.description;
  if (!description) {
    description = '';
  }
  if (!estimation_time) {
    estimation_time = 0;
  } else {
    estimation_time = parseInt(estimation_time)
  }
  if ( !randoData.userToken, !randoData.name, !randoData.latitude, !randoData.longitude ) {
    return res.json({ result: false, error: 'Inputs incorrects' })
  }



  //    console.log(JSON.stringify(randoData))
  var newRando = new randoModel({
    mixed: randoData.mixed,
    userToken: randoData.userToken,
    name: randoData.name,
    departure: randoData.departure,
    latitude: randoData.latitude,
    longitude: randoData.longitude,
    maxUsers: parseInt(randoData.maxRunner),
    users: [],
    date: new Date(randoData.date),
    estimation_time: estimation_time,
    description: randoData.description,
    level: randoData.level,
  });
  console.log('rando save');
  var randoSaved = await newRando.save();
  console.log(randoSaved)

  return res.json({ success: true })
});

module.exports = router;
