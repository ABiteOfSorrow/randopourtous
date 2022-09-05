let express = require('express')
let router = express.Router()
let cloudinary = require("cloudinary").v2;
let fs = require("fs");
let uniqid = require("uniqid");
require("dotenv").config();
//var request = require("sync-request");

let randoModel = require('../models/rando');
let UserModel = require('../models/user');

const IndexController = require('../controllers/index');

// cloudinary for upload photos
cloudinary.config({
  cloud_name: "rupo",
  api_key: process.env.ApiKey,
  api_secret: process.env.ApiSecret,
});

/* GET home page. */
router.get('/', function (req, res) {
  res.json({ title: "Welcome to Backend REST api." })
})

router.post('/create-track', async function (req, res, next) {
  let randoData = req.body
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
    // console.log(JSON.stringify(randoData))
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
    users: [foundUser.id],
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
  return res.json({ result: true, rando: randoSaved, user: foundUser })
})

router.post('/search-track', async function (req, res, next) {
  let searchData = req.body;
  //***** Securisation des données de recherche: null si vide */
  let citie = searchData.ville.nom ? searchData.ville.nom : null
  let dpt = searchData.ville.dpt ? parseInt(searchData.ville.dpt) : null
  let codePostal = searchData.ville.codePostal
    ? searchData.ville.codePostal
    : null

  //***** mixe et age pas encore traité  */
  // let mixte = searchData.mixte ? searchData.mixte : undefined
  // let age = searchData.age ? searchData.age : undefined

  //*****  */
  let level = searchData.niveau ? searchData.niveau : null
  let date = searchData.date ? new Date(searchData.date) : null

  // console.log('citie: ', citie)
  // console.log('level: ', level)
  // console.log('date: ', date)
  // console.log('CP: ', codePostal)
  // console.log('dpt: ', dpt)
  //console.log(codePostal.length)
  // if (!codePostal) {
  //   return res.json({ success: false, error: 'Veuillez mettre un code postal' })
  // }
  let result;
  if (level === null && date === null && citie === null && dpt === null) {
    console.log('find all')
    result = await randoModel.find()
  } else {
    // cas où l'on indique un code postale à 2 chiffre ie département
    if (codePostal !== null && codePostal.length === 2) {
      result = await randoModel.find({
        'departure.dpt': parseInt(dpt),
        level: level !== null ? level : { $exists: true },
        date: date !== null ? { $gte: date } : { $exists: true },
      })
    } else {
      result = await randoModel.find({
        'departure.nom': citie !== null ? citie : { $exists: true },
        level: level !== null ? level : { $exists: true },
        date: date !== null ? { $gte: date } : { $exists: true },
        finished: false
      })
    }
  }
  if (result.length == 0) {
    return res.json({ success: false })
  }
  return res.json({ success: true, result: result })
})


router.post('/get-tracks', async function (req, res, next) {

  let tracks = req.body.tracks
  let userId = req.body._id
  let fullInfoTracks = []
  if (!tracks || !userId) {
    return res.json({ result: false, error: 'Inputs incorrects' })
  }

  for (let i = 0; i < tracks.length; i++) {
    var result = await randoModel.findById(tracks[i])

    if (result != null) {
      fullInfoTracks.push(result)
    }
  }

  let randosInBDD = await randoModel.find();

  for (oneRando of randosInBDD) {
    for (participant of oneRando.users) {
      //console.log("oneRando ",oneRando)
      //Si le participant dans la liste users est celui renvoyé dans la requete et qu'il est pas déjà dans la liste
      if (participant === userId && fullInfoTracks.find(e => e.id == oneRando.id) == undefined) {
        fullInfoTracks.push(oneRando);
      }
    }
  }
  return res.json({ success: true, fullInfoTracks });
})

router.get('/get-track', async (req, res) => {
  if (!req.query.id) {
    return res.json({ result: false, error: 'Token manquant svp' });
  }
  let foundRando = await randoModel.findById(req.query.id);
  if (!foundRando) {
    return res.json({ result: false, error: 'Rando pas trouvé svp' });
  }
  return res.json({ result: true, track: foundRando });
});

//Request Post for upload photo to cloudinary & send to frontend
router.post("/upload", async function (req, res) {
  //  console.log(req.body.rando)
  var imagePath = "./tmp/" + uniqid() + ".jpg";
  // console.log(imagePath)
  var resultCopy = await req.files.avatar.mv(imagePath);
  // // console.log(req.files.photo);
  // // console.log(req.files.photo.name); // nom d'origine de l'image
  // // console.log(req.files.photo.mimetype); // format de fichier
  // // console.log(req.files.photo.data); // données brutes du fichier
  if (!resultCopy) {
    let result = await cloudinary.uploader.upload(imagePath);
    //Ajouter des photos au BD
    await randoModel.updateOne({ _id: req.body.rando }, { $addToSet: { randoImage: { source: result.url } } })
    res.json({ result: true, message: "File uploaded!", photo: result });
  } else {
    res.json({ result: false, message: resultCopy });
  }
  fs.unlink(imagePath, (err) => {
    if (err) console.log(err)
  });
});

//*** route qui permet d'ajouter un nouveau participant à la randonnée */
router.get('/add-user-track', async (req, res) => {
  try {
    let userId = req.query.userid
    let trackId = req.query.trackid
    //*** on ajoute au tableau users l'Id du nouveau participant */
    let result = await randoModel.updateOne({ _id: trackId }, { $addToSet: { users: userId } })
    if (!result) {
      return res.json({ result: false, })
    }
    // tout se passe bien
    return res.json({ result: true, });

  } catch (err) {
    return res.json({ result: false, error: JSON.stringify(err) })
  }
});

//*** route de vérification de la présence d'un utisateur dans la liste des participants */

router.get('/search-user-track', async (req, res) => {

  if (!req.query.trackid) {
    return res.json({ result: false, error: 'Id de rando manquant (serveur).' })
  }
  if (req.query.trackid.length < 24 || req.query.trackid.length > 24) {
    return res.json({ result: false, error: 'Id de rando invalide (serveur).' })
  }
  try {
    let result = await randoModel.findById(req.query.trackid)
    if (!result) {
      return res.json({ result: false, });
    }
    return res.json({ result: true, rando: result });

  } catch (error) {
    console.log(error);
    return res.json({ result: false, error: 'Erreur serveur.' })
  }
});

router.post('/finish-track', async (req, res) => {
  //console.log("req.body ", req.body)
  let result = await randoModel.updateOne(
    { _id: req.body._id },
    { finished: true });
  if (!result) {
    return res.json({ result: false });
  }
  return res.json({ result: true });
})


// Mise à jour des évaluations pour chaque rando
router.post('/update-randorating', async (req, res) => {
  // Evaluation for each rando
  let privateNote = await randoModel.updateOne({ _id: req.body.randoId },
    {
      $addToSet: {
        tempEvaluations:
        {
          _id: req.body.userId, averageNote: req.body.averageRating, paysageNote: req.body.paysageValue,
          ambianceNote: req.body.ambianceValue, difficultyNote: req.body.difficultyValue
        }
      }
    })
  //console.log(privateNote)
  // Update average note for rando
  let randoNote = await randoModel.findById(req.body.randoId)
  let temp = 0;
  for (let i = 0; i < randoNote.tempEvaluations.length; i++) {
    temp += randoNote.tempEvaluations[i].averageNote
  }
  //Save result to DB
  randoNote.evaluations = (temp / randoNote.tempEvaluations.length).toFixed(2)
  //console.log(randoNote.evaluations)
  let savedRando = await randoNote.save();

  //Find user for update hie average evaluation
  let foundUser = await UserModel.findOne({ _id: req.body.userId });
  if (!foundUser) {
    return res.json({ result: false, error: 'User is missing.' });
  }
  // If it was his first rando or not
  if (foundUser.tracks.length <= 1) {
    foundUser.averageRating = randoNote.evaluations
  } else {
    foundUser.averageRating =
      ((foundUser.averageRating * (foundUser.tracks.length - 1)) + randoNote.evaluations) / foundUser.tracks.length
  }
  let savedUser = await foundUser.save();

  if (!privateNote || !savedRando || !savedUser) {
    return res.json({ result: false, error: 'Erreur du serveur.' })
  }
  return res.json({ result: true, user: savedUser })
});

// Pour afficher écran de ResumeScreen par defaut
router.post('/get-resume', async (req, res) => {

  let averageNote = 0;
  let paysageNote = 0;
  let ambianceNote = 0;
  let difficultyNote = 0;
  let randoPhotos = [];
  let result;
  try {
    result = await randoModel.findById(req.body.randoId)
  } catch (err) {
    return res.json({ result: false, error: JSON.stringify(err) })
  }
  if (!result) {
    return res.json({ result: false, error: `Il n'y a pas de rando` })
  }
  for (let i = 0; i < result.tempEvaluations.length; i++) {
    if (result.tempEvaluations[i]._id == req.body.userId) {
      averageNote = result.tempEvaluations[i].averageNote
      paysageNote = result.tempEvaluations[i].paysageNote
      ambianceNote = result.tempEvaluations[i].ambianceNote
      difficultyNote = result.tempEvaluations[i].difficultyNote
    }
  } randoPhotos = result.randoImage
  return res.json({ result: true, averageNote, paysageNote, ambianceNote, difficultyNote, randoPhotos })
});


module.exports = router;
