var express = require('express')
var router = express.Router()
var randoModel = require('../models/rando')

var uid2 = require('uid2')
const {json} = require('express')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'})
})

router.post('/create-track', async function (req, res, next) {
  // console.log(JSON.stringify(req.body))
  var randoData = req.body
  let estimation_time = randoData.estim_time
  let description = randoData.description
  if (!description) {
    description = ''
  }
  if (!estimation_time) {
    estimation_time = 0
  } else {
    estimation_time = parseInt(estimation_time)
  }
  if (
    (!randoData.userToken,
    !randoData.name,
    !randoData.latitude,
    !randoData.longitude)
  ) {
    return res.json({result: false, error: 'Inputs incorrects'})
  }

  //    console.log(JSON.stringify(randoData))
  var newRando = new randoModel({
    mixed: randoData.mixed,
    userToken: randoData.userToken,
    name: randoData.name,
    departure: randoData.departure,
    latitude: randoData.latitude,
    longitude: randoData.longitude,
    maxRunner: parseInt(randoData.maxRunner),
    date: new Date(randoData.date),
    estimation_time: estimation_time,
    description: randoData.description,
    users: [],
    level: randoData.level,
  })
  console.log('rando save')
  var randoSaved = await newRando.save()
  console.log(randoSaved)

  return res.json({success: true})
})

router.post('/search-track', async function (req, res, next) {
  let searchData = req.body
  console.log('données recues: ', searchData)

  //***** Securisation des données de recherche */
  let citie = searchData.ville.nom ? searchData.ville.nom : undefined
  let dpt = searchData.ville.dpt ? searchData.ville.dpt : undefined
  let codePostal = searchData.codePostal ? searchData.codePostal : undefined
  let mixte = searchData.mixte ? searchData.mixte : undefined
  let age = searchData.age ? searchData.age : undefined
  let level = searchData.niveau ? searchData.niveau : null
  let date = searchData.date ? searchData.date : undefined

  var result = await randoModel.find({
    'departure.nom': citie,
    level: null || level,
  })

  console.log(result)

  return res.json({success: true, result: result})
})

module.exports = router
