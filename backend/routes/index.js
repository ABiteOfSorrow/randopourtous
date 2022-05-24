var express = require('express')
var router = express.Router()
var cloudinary = require("cloudinary").v2;
var fs = require("fs");
var uniqid = require("uniqid");
var request = require("sync-request");



var randoModel = require('../models/rando')
let UserModel = require('../models/user');
const rando = require('../models/rando');



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
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
    return res.json({ result: false, error: 'Token manquant.' })
  }
  if (!token || !randoData.name || !randoData.coordinate || !randoData.date) {
    console.log(JSON.stringify(randoData))
    return res.json({ result: false, error: 'Inputs incorrects' })
  }

  //Récupération des infos user pour mettre en tant que participant
  let foundUser = await UserModel.findOne({ token })
  if (!foundUser) {
    return res.json({ result: false, error: 'Mauvais token' })
  }
  // ajout du créateur aux participants
  let user = foundUser._id;
    
  // tableau des participants
  let users = []
  users.push(user)
  var newRando = new randoModel({
    mixed: randoData.mixed,
    userId: foundUser.id,
    name: randoData.name,
    coordinate: randoData.coordinate,
    maxUsers: parseInt(randoData.maxRunner),
    users:[foundUser.id],
    departure: randoData.departure,
    date: new Date(randoData.date),
    estimation_time: estimation_time,
    description: randoData.description,
    level: randoData.level,
    finished: false,
    organisator: foundUser.username,
  })
  var randoSaved = await newRando.save()

  //Ajout de la rando dans la liste de partication de l'user
  if (randoSaved) {
    foundUser.tracks.push(randoSaved._id)
    await foundUser.save()
  }

  return res.json({result: true, rando: randoSaved, user: foundUser})
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

  //console.log(codePostal.length)
  if (!codePostal) {
    return res.json({ success: false, error: 'Veuillez mettre un code postal' })
  }
  if (codePostal.length === 2) {
    var result = await randoModel.find({
      'departure.dpt': parseInt(dpt),
      level: level !== null ? level : { $exists: true },
    })
  } else {
    var result = await randoModel.find({
      'departure.nom': citie,
      level: level !== null ? level : { $exists: true },
    })
  }

  console.log(result)

  return res.json({ success: true, result: result })
})


router.post('/get-tracks', async function (req, res, next) {

  let tracks = req.body.tracks
  let userId = req.body._id
  let fullInfoTracks = []


  for (let i = 0; i < tracks.length; i++) {
    var result = await randoModel.findById(tracks[i])

    if (result != null) {
      fullInfoTracks.push(result)
    }
  }

  let randosInBDD = await randoModel.find();
  
  for(oneRando of randosInBDD){
    for(participant of oneRando.users){
      if(participant === userId && fullInfoTracks.find(e => e.id == oneRando.id) == undefined){
        fullInfoTracks.push(oneRando)
      }
    }
  }

  return res.json({ success: true, fullInfoTracks })
})

router.get('/get-track', async (req, res) => {
  if (!req.query.id) {
    return res.json({ result: false, error: 'Token manquant svp' })
  }
  let foundRando = await randoModel.findById(req.query.id);
  if (!foundRando) {
    return res.json({ result: false, error: 'Rando pas trouvé svp' })
  }
  return res.json({ result: true, track: foundRando })

});


// cloudinary for upload photos
cloudinary.config({
  cloud_name: "rupo",
  api_key: "844975946581267",
  api_secret: "vxmNTX3GRyB5KMi8xWp9IM8u2zs",
});

//Request Post for upload photo to cloudinary & send to frondend
router.post("/upload", async function (req, res, next) {
  var imagePath = "./tmp/" + uniqid() + ".jpg";
  console.log(imagePath)
  var resultCopy = await req.files.avatar.mv(imagePath);

  // console.log(req.files.avatar);
  // console.log(req.files.avatar.name); // nom d'origine de l'image
  // console.log(req.files.avatar.mimetype); // format de fichier
  // console.log(req.files.avatar.data); // données brutes du fichier

  if (!resultCopy) {
    var result = await cloudinary.uploader.upload(imagePath);
    console.log(result);
    res.json({ result: true, message: "File uploaded!", photo: result });
  } else {
    res.json({ result: false, message: resultCopy });
  }
  fs.unlinkSync(imagePath);
});




//*** route qui permet d'ajouter un nouveau participant à la randonnée */

router.get('/add-user-track', async (req, res) => {

  var userId = req.query.userid
  var trackId = req.query.trackid

  //*** on ajoute au tableau users l'Id du nouveau participant */

  var result = await randoModel.updateOne({ _id: trackId }, { $addToSet: { users: userId } })

  if (result) {
    return res.json({ result: true, })
  } else {
    return res.json({ result: false, })
  }

});

//*** route de vérification de la présence d'un utisateur dans la liste des participants */

router.get('/search-user-track', async (req, res) => {

  // var userId= req.query.userid


  console.log(req.query)
  var result = await randoModel.findById(req.query.trackid)

  if (result) {

    return res.json({ result: true, rando: result })
  } else {
    return res.json({ result: false, })
  }


});

module.exports = router;
