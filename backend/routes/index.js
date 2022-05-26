var express = require('express')
var router = express.Router()
var cloudinary = require("cloudinary").v2;
var fs = require("fs");
var uniqid = require("uniqid");
var request = require("sync-request");

var randoModel = require('../models/rando');
var UserModel = require('../models/user');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
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
if(level===null && date===null &&citie===null&&dpt===null){
  console.log('find all')
  var result = await randoModel.find()}else{
  
  
  // cas où l'on indique un code postale à 2 chiffre ie département
  
  if (codePostal!==null && codePostal.length === 2) {
    var result = await randoModel.find({
      'departure.dpt': parseInt(dpt),
      level: level !== null ? level : { $exists: true },
      date: date !== null ? {$gte: date} : { $exists: true },
    })
  } else {
    var result = await randoModel.find({
      'departure.nom': citie!==null?citie:{$exists:true},
      level: level !== null ? level : { $exists: true },
      date: date !== null ? {$gte: date} : { $exists: true },
      finished:false
      
    })
  }
}
  // console.log(result)
  if(result.length!==0){

    return res.json({ success: true, result: result })
  }else{
    return res.json({ success: false})

  }

})


router.post('/get-tracks', async function (req, res, next) {

  let tracks = req.body.tracks
  let userId = req.body._id
  let fullInfoTracks = []
  if (!tracks || !userId ) {
    return res.json({ result: false, error: 'Inputs incorrects' })
  }

  for (let i = 0; i < tracks.length; i++) {
    var result = await randoModel.findById(tracks[i])

    if (result != null) {
      fullInfoTracks.push(result)
    }
  }

  let randosInBDD = await randoModel.find();
  
  for(oneRando of randosInBDD){
    for(participant of oneRando.users){
      //console.log("oneRando ",oneRando)
      //Si le participant dans la liste users est celui renvoyé dans la requete et qu'il est pas déjà dans la liste
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
  console.log(req.body)
  // var imagePath = "./tmp/" + uniqid() + ".jpg";
  // // console.log(imagePath)
  // var resultCopy = await req.files.avatar.mv(imagePath);

  // // console.log(req.files.avatar);
  // // console.log(req.files.avatar.name); // nom d'origine de l'image
  // // console.log(req.files.avatar.mimetype); // format de fichier
  // // console.log(req.files.avatar.data); // données brutes du fichier

  // if (!resultCopy) {
  //   var result = await cloudinary.uploader.upload(imagePath);
  //   // console.log(result);
  //   // var result = await randoModel.updateOne({ _id: trackId }, { $addToSet: { users: userId } })

    
  //   res.json({ result: true, message: "File uploaded!", photo: result });
  // } else {
  //   res.json({ result: false, message: resultCopy });
  // }
  // fs.unlinkSync(imagePath);
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
  //console.log(req.query)\
  if (!req.query.trackid) {
    return res.json({ result: false, error: 'Id de rando manquant (serveur).' })
  }
  if (req.query.trackid.length < 24 || req.query.trackid.length > 24) {
    return res.json({ result: false, error: 'Id de rando invalide (serveur).' })
  }
  var result = await randoModel.findById(req.query.trackid)

  if (result) {

    return res.json({ result: true, rando: result })
  } else {
    return res.json({ result: false, })
  }


});

router.post('/finish-track', async (req, res) => {
  console.log("req.body ",req.body)

  let result = await randoModel.updateOne(
    { _id: req.body._id},
    {finished: true}
  );
  if (result) {
    return res.json({ result: true})
  } else {
    return res.json({ result: false})
  }
})


// Mise à jour des évaluations pour chaque rando
router.post('/update-randorating', async (req, res) => {
// Evaluation for each rando
  let privateNote = await randoModel.updateOne({ _id: req.body.randoId }, 
    { $addToSet : {tempEvaluations: 
      {_id: req.body.userId, averageNote: req.body.averageRating, paysageNote: req.body.paysageValue, 
        ambianceNote: req.body.ambianceValue, difficultyNote: req.body.difficultyValue} } })
// Update average note for rando
  let randoNote = await randoModel.findById(req.body.randoId)
    let temp = 0;
      for(let i=0; i<randoNote.tempEvaluations.length; i++){
        temp += randoNote.tempEvaluations[i].averageNote
      }
//Save result to DB
      randoNote.evaluations = (temp / randoNote.tempEvaluations.length).toFixed(2)
      let savedRando = await randoNote.save();

//Find user for update hie average evaluation
      let foundUser = await UserModel.findOne({ _id: req.body.userId });
      if (!foundUser) {
        return res.json({ result: false, error: 'User is missing.' });
      }
// If it was his first rando or not
      if(foundUser.tracks.length <= 1){
        foundUser.averageRating = randoNote.evaluations
      } else {
      foundUser.averageRating = 
      ((foundUser.averageRating * (foundUser.tracks.length -1)) + randoNote.evaluations) / foundUser.tracks.length
    }
      let savedUser = await foundUser.save();


  if (privateNote && savedRando && savedUser ) {
    return res.json({ result: true, user: savedUser})
  } else {
    return res.json({ result: false, })
  }

});

// Pour afficher écran de ResumeScreen par defaut
router.post('/get-resume', async (req, res) => {

  // console.log(req.body)
 
  let averageNote = 0;
  let paysageNote = 0;
  let ambianceNote = 0;
  let difficultyNote = 0;

  var result = await randoModel.findById(req.body.randoId)
  if(!result){
    return res.json({ result: false, error: `Il n'y a pas de rando` })
  } else if (result) {
    for (let i=0; i<result.tempEvaluations.length; i++){
      if (result.tempEvaluations[i]._id == req.body.userId){
        averageNote = result.tempEvaluations[i].averageNote
        paysageNote = result.tempEvaluations[i].paysageNote 
        ambianceNote = result.tempEvaluations[i].ambianceNote
        difficultyNote = result.tempEvaluations[i].difficultyNote
      }
    }
    return res.json({ result: true, averageNote, paysageNote, ambianceNote, difficultyNote})
  } 
});


module.exports = router;
