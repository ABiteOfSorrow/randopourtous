let mongoose = require('./connection')

var messageSchema = mongoose.Schema({
  id: Number,
  author: String,
  text: String,
  createdAt: Date,
  user: {},
})
var departureSchema = mongoose.Schema({
  nom: String,
  dpt: Number,
  codePostal: Number,
})

var tempEvaluationsSchema = mongoose.Schema({
  averageNote: Number,
  paysageNote: Number,
  ambianceNote: Number,
  difficultyNote: Number
})

var randoImageSchema = mongoose.Schema({
  source: String,
})

// create rando schema
let randoSchema = new mongoose.Schema({
  mixed: Boolean,
  name: String,
  departure: departureSchema, //Ne pas oublier la log et lat
  coordinate: Object,
  maxUsers: Number,
  users: Array,
  estimation_time: Number,
  messages: [messageSchema],
  date: Date,
  description: String,
  evaluations: Number,
  tempEvaluations: [tempEvaluationsSchema],
  randoImage: [randoImageSchema],
  finished: Boolean,
  level: String,
  userId: String,
  organisator: String
})

// link schema to collection
let rando = mongoose.model('rando', randoSchema)

module.exports = rando
