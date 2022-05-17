var express = require('express');
var router = express.Router();
var randoModel = require('../models/rando');

var uid2 = require('uid2');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/create-track', async function (req, res, next) {
  console.log("route", req.body.randoData)
    var randoData = req.body.randoData
      var newRando = new randoModel({
        mixed: randoData.mixed,
        userToken: randoData.token,
        name: randoData.name,
        departure: randoData.departure,
        maxRunner: randoData.maxRunner,
        date: randoData.date,
        estimation_time: randoData.estim_time,
        description: randoData.description,
        level: randoData.level,
      });
      var randoSaved = await newRando.save();
  return res.json({ success:true })
  });

module.exports = router;
