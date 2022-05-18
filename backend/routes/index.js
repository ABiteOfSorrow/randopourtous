var express = require('express');
var router = express.Router();
var randoModel = require('../models/rando');

var uid2 = require('uid2');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/create-track', async function (req, res, next) {
 // console.log(JSON.stringify(req.body))
    var randoData = req.body
   // console.log(randoData.name)

//    console.log(JSON.stringify(randoData))
      var newRando = new randoModel({
        mixed: randoData.mixed,
        userToken: randoData.userToken,
        name: randoData.name,
        departure: randoData.departure,
        latitude: randoData.latitude,
        longitude: randoData.longitude,
        maxRunner: parseInt(randoData.maxRunner),
        date: randoData.date,
        estimation_time: parseInt(randoData.estim_time),
        description: randoData.description,
        level: randoData.level,
      });
      console.log('rando save')
      var randoSaved = await newRando.save();
      console.log(randoSaved)
      randoModel.deleteMany()
  return res.json({ success:true })
  });

module.exports = router;
