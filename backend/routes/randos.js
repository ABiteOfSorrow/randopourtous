var express = require('express');
var router = express.Router();
//var request = require('sync-request');
var uid2 = require('uid2');

var randoModel = require('../models/rando');


router.post('/create-rando', async function (req, res, next) {

      var newRando = new randoModel({
        id: uid2(32),
        mixed: req.body.mixed,
        userToken: req.body.token,
        name: req.body.name,
        departure: req.body.departure,
        arrival: req.body.arrival,
        maxRunner: req.body.maxRunner,
        date: req.body.date,
        estimation_time: req.body.estim_time,
        description: req.body.description,
        level: req.body.level,
      });
      var randoSaved = await newRando.save();

  });