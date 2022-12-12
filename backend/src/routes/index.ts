import express from 'express'
const router = express.Router()
import fs from "fs";
const cloudinary = require("../models/cloudinary");
import uid2 from 'uid2';

import RandoModel from '../models/rando';
import UserModel from '../models/user';

/* GET index. */
router.get('/', (req, res) => {
  res.status(200).json({ title: "Welcome to Backend REST api." })
})

router.post('/create-track', async (req, res) => {
  let randoData = req.body
  let estimation_time = randoData.estimation_time
  let description = randoData.description
  //sécurité contre champs vide
  if (!description) {
    description = ''
  }
  if (!estimation_time) estimation_time = 0
  else estimation_time = parseInt(estimation_time)
  let token = randoData.token
  if (!token) {
    return res.json({ result: false, error: 'Token manquant.' })
  }
  if (!token || !randoData.name || !randoData.coordinate || !randoData.date) {
    return res.json({ result: false, error: 'Inputs incorrects' })
  }
  //Récupération des infos user pour mettre en tant que participant
  let foundUser = await UserModel.findOne({ token }).catch(e => {
    console.error(e)
    return null
  })
  if (!foundUser) {
    return res.json({ result: false, error: 'Mauvais token' })
  }

  // tableau des participants
  let users: any[] = []
  // ajout du créateur aux participants
  users.push(foundUser._id)
  var newRando = new RandoModel({
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

router.post('/search-track', async (req, res) => {
  let searchData = req.body;
  //***** Securisation des données de recherche: null si vide */
  let citie = searchData.ville.nom ? searchData.ville.nom : null
  let dpt = searchData.ville.dpt ? parseInt(searchData.ville.dpt) : ""
  let codePostal = searchData.ville.codePostal
    ? searchData.ville.codePostal
    : null

  //***** mixe et age pas encore traité  */
  // let mixte = searchData.mixte ? searchData.mixte : undefined
  // let age = searchData.age ? searchData.age : undefined

  let level = searchData.niveau ? searchData.niveau : null
  let date = searchData.date ? new Date(searchData.date) : null

  let result;
  if (level === null && date === null && citie === null && dpt === "") {
    result = await RandoModel.find()
  } else {
    // cas où l'on indique un code postale à 2 chiffre ie département
    if (codePostal !== null && codePostal.length === 2) {
      result = await RandoModel.find({
        'departure.dpt': dpt,
        level: level !== null ? level : { $exists: true },
        date: date !== null ? { $gte: date } : { $exists: true },
      })
    } else {
      result = await RandoModel.find({
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


router.post('/get-tracks', async (req, res) => {

  let tracks = req.body.tracks
  let userId = req.body._id
  let fullInfoTracks: any[] = [];
  if (!tracks || !userId) {
    return res.json({ result: false, error: 'Inputs incorrects' })
  }

  for (let i = 0; i < tracks.length; i++) {
    var result = await RandoModel.findById(tracks[i]).catch(() => null)
    if (result != null) fullInfoTracks.push(result)
  }
  let randosInBDD = await RandoModel.find().catch(e => {
    console.error(e)
    return null;
  });
  if (randosInBDD === null) return res.json({ result: false, error: "Server error." })

  for (let oneRando of randosInBDD) {
    for (let participant of oneRando.users) {
      //Si le participant dans la liste users est celui renvoyé dans la requete et qu'il est pas déjà dans la liste
      if (participant === userId && fullInfoTracks.find(e => e.id == oneRando.id) == undefined) {
        fullInfoTracks.push(oneRando);
      }
    }
  }
  return res.json({ success: true, fullInfoTracks });
})

router.get('/get-track', async (req, res) => {
  if (!req.query.id) return res.status(401).json({ result: false, error: 'Missing token.' });

  let foundRando = await RandoModel.findById(req.query.id).catch(e => {
    console.error(e);
    return null;
  });

  if (!foundRando) return res.json({ result: false, error: 'Track not found.' });
  return res.json({ result: true, track: foundRando });
});

//Request Post for upload photo to cloudinary & send to frontend
router.post("/upload", async (req, res) => {
  if (!req.files) return res.json({ result: false, message: "No file provided." })

  if (Array.isArray(req.files.avatar)) {
    return res.json({ result: false, message: "Too many files." })
  }
  const imagePath = "./tmp/" + uid2() + ".jpg";
  const resultCopy = await req.files.avatar.mv(imagePath).catch(e => {
    res.json({ result: false, message: resultCopy });
  });
  const result = await cloudinary.uploader.upload(imagePath);
  //Ajouter des photos au BD
  await RandoModel.updateOne({ _id: req.body.rando }, { $addToSet: { randoImage: { source: result.url } } })
  fs.unlink(imagePath, (err) => {
    if (err) console.log(err);
  });
  return res.json({ result: true, message: "File uploaded!", photo: result });
});

//*** route qui permet d'ajouter un nouveau participant à la randonnée */
router.get('/add-user-track', async (req, res) => {
  try {
    let userId = req.query.userid
    let trackId = req.query.trackid
    //*** on ajoute au tableau users l'Id du nouveau participant */
    let result = await RandoModel.updateOne({ _id: trackId }, { $addToSet: { users: userId } }).catch(e => {
      console.error(e)
      return null
    })
    if (!result) return res.json({ result: false, error: "" })
    // tout se passe bien
    return res.json({ result: true, });
  } catch (err) {
    return res.json({ result: false, error: JSON.stringify(err) })
  }
});

//*** route de vérification de la présence d'un utisateur dans la liste des participants */
router.get('/search-user-track', async (req, res) => {

  if (!req.query.trackid || !req.query?.trackid?.length) {
    return res.json({ result: false, error: 'Id de rando manquant (serveur).' })
  }
  if (req.query.trackid.length < 24 || req.query.trackid.length > 24) {
    return res.json({ result: false, error: 'Id de rando invalide (serveur).' })
  }
  try {
    let result = await RandoModel.findById(req.query.trackid)
    if (!result) return res.json({ result: false, });
    return res.json({ result: true, rando: result });
  } catch (error) {
    console.log(error);
    return res.json({ result: false, error: 'Erreur serveur.' })
  }
});

router.post('/finish-track', async (req, res) => {
  let result = await RandoModel.updateOne(
    { _id: req.body._id },
    { finished: true }
    ).catch(e => {
      console.error(e)
      return null;
    })
  if (!result) return res.json({ result: false, error: "Server Error." });
  return res.json({ result: true });
})


// Mise à jour des évaluations pour chaque rando
router.post('/update-randorating', async (req, res) => {
  // Update average note for rando
  let randoNote = await RandoModel.findById(req.body.randoId)
  if (!randoNote) return res.json({ result: false, error: "Track not found." })

  // Evaluation for each rando
  let privateNote = await RandoModel.updateOne({ _id: req.body.randoId },
    {
      $addToSet: {
        tempEvaluations:
        {
          _id: req.body.userId, averageNote: req.body.averageRating, paysageNote: req.body.paysageValue,
          ambianceNote: req.body.ambianceValue, difficultyNote: req.body.difficultyValue
        }
      }
    })

  let temp = 0;
  for (let i = 0; i < randoNote.tempEvaluations.length; i++) {
    if (randoNote.tempEvaluations[i]?.averageNote !== undefined) {
      temp += randoNote.tempEvaluations[i]?.averageNote
    } else {
      
    }
  }
  //Save result to DB
  randoNote.evaluations = parseInt((temp / randoNote.tempEvaluations.length).toFixed(2))
  let savedRando = await randoNote.save();

  //Find user for update hie average evaluation
  let foundUser = await UserModel.findOne({ _id: req.body.userId });
  if (!foundUser) {
    return res.json({ result: false, error: 'User is missing.' });
  }
  // If it was his first rando or not
  if (foundUser.tracks.length <= 1 || !foundUser.averageRating) foundUser.averageRating = randoNote.evaluations || 1
  else {

    const averageRating = ((foundUser.averageRating * (foundUser.tracks.length - 1)) + randoNote.evaluations) / foundUser.tracks.length
    foundUser.averageRating = averageRating;
  }
  let savedUser = await foundUser.save().catch(e => {
    console.error(e)
    return null;
  });

  if (!privateNote || !savedRando || !savedUser) {
    return res.json({ result: false, error: 'Server error.' })
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
    result = await RandoModel.findById(req.body.randoId)
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

export default router
