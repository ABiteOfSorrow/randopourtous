var express = require('express')
var router = express.Router()
var cloudinary = require("cloudinary").v2;

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

<<<<<<< HEAD
// cloudinary
cloudinary.config({
  cloud_name: "rupo",
  api_key: "844975946581267",
  api_secret: "vxmNTX3GRyB5KMi8xWp9IM8u2zs",
});

//Request Post for upload photo to cloudinary & send to frondend
router.post("/upload", async function (req, res, next) {
  var imagePath = "./tmp/" + uniqid() + ".jpg";
  var resultCopy = await req.files.avatar.mv(imagePath);

  // console.log(req.files.avatar);
  // console.log(req.files.avatar.name); // nom d'origine de l'image
  // console.log(req.files.avatar.mimetype); // format de fichier
  // console.log(req.files.avatar.data); // données brutes du fichier

  if (!resultCopy) {
    var result = await cloudinary.uploader.upload(imagePath);
    var options = {
      json: {
        apiKey: "5c0a5d392c1745d2ae84dc0b1483bfd2",
        image: result.url,
      },
    };  

  }
})



=======
router.post('/get-tracks', async function (req, res, next) {

  let tracks = JSON.stringify(req.body.ids);
  let listingTracks = tracks.split(',')
  let fullInfoTracks = []
  

  for(let i=0;i < listingTracks.length; i++){
    var result = await randoModel.findById(listingTracks[i])
    console.log(result)
   //console.log("sprout",listingTracks[i])
   if(result != null){
      fullInfoTracks.push(result)
   }
 }
 console.log(fullInfoTracks)
 // console.log('rouetr resullt',result)
  
  return res.json({success: true})
})

>>>>>>> b0091577a6a8e819d342a0d708c679caaf346ad9
module.exports = router
