var express = require('express')
var router = express.Router()
var randoModel = require('../models/rando')
let UserModel = require('../models/user')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'})
})

router.post('/create-track', async function (req, res, next) {
  var randoData = req.body
  let estimation_time = randoData.estimation_time
  let description = randoData.description

  //sécurité contre champs vide
  if (!description) {
    description = ''
  }
  if (!estimation_time) {
    estimation_time = 0
  } else {
    estimation_time = parseInt(estimation_time)
  }
  let token = randoData.token
  if (!token) {
    return res.json({result: false, error: 'Token manquant.'})
  }
  if (!token || !randoData.name || !randoData.coordinate || !randoData.date) {
    console.log(JSON.stringify(randoData))
    return res.json({result: false, error: 'Inputs incorrects'})
  }

  //Récupération des infos user pour mettre en tant que participant
  let foundUser = await UserModel.findOne({token})
  if (!foundUser) {
    return res.json({result: false, error: 'Mauvais token'})
  }

  let user = {
    _id: foundUser._id,
    username: foundUser.username,
    name: foundUser.name,
    lastname: foundUser.lastname,
  }

  let users = []
  users.push(user)
  var newRando = new randoModel({
    mixed: randoData.mixed,
    userId: foundUser.id,
    name: randoData.name,
    coordinate: randoData.coordinate,
    maxUsers: parseInt(randoData.maxRunner),
    users,
    departure: randoData.departure,
    date: new Date(randoData.date),
    estimation_time: estimation_time,
    description: randoData.description,
    level: randoData.level,
    finished: false
  })
  var randoSaved = await newRando.save()

  //Ajout de la rando dans la liste de partication de l'user
  if (randoSaved) {
    foundUser.tracks.push(randoSaved._id)
    await foundUser.save()
  }

  return res.json({result: true})
})

router.post('/search-track', async function (req, res, next) {
  let searchData = req.body
  console.log('données recues: ', searchData)

  //***** Securisation des données de recherche: null si vide */
  let citie = searchData.ville.nom ? searchData.ville.nom : undefined
  let dpt = searchData.ville.dpt ? parseInt(searchData.ville.dpt) : undefined
  let codePostal = searchData.ville.codePostal
    ? searchData.ville.codePostal
    : null
  let mixte = searchData.mixte ? searchData.mixte : undefined
  let age = searchData.age ? searchData.age : undefined
  let level = searchData.niveau ? searchData.niveau : null
  let date = searchData.date ? searchData.date : undefined

  console.log(codePostal.length)
  if (codePostal.length === 2) {
    var result = await randoModel.find({
      'departure.dpt': parseInt(dpt),
      level: level !== null ? level : {$exists: true},
    })
  } else {
    var result = await randoModel.find({
      'departure.nom': citie,
      level: level !== null ? level : {$exists: true},
    })
  }

  console.log(result)

  return res.json({success: true, result: result})
})

router.post('/get-tracks', async function (req, res, next) {

  let tracks = req.body
  //let listingTracks = tracks.split(',')
  //console.log(listingTracks)
  let fullInfoTracks = []
  

  for(let i=0;i < tracks.length; i++){
    var result = await randoModel.findById(tracks[i])
    //console.log(result)
   //console.log("sprout",listingTracks[i])
   if(result != null){
      fullInfoTracks.push(result)
   }
 }
 //console.log("test",fullInfoTracks)
 // console.log('rouetr resullt',result)
  
  return res.json({success: true, fullInfoTracks })
})

module.exports = router
