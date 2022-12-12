import mongoose from './connection'
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  id: Number,
  author: String,
  text: String,
  createdAt: Date,
  user: {},
})
const departureSchema = new Schema({
  nom: String,
  dpt: Number,
  codePostal: Number,
})

const tempEvaluationsSchema = new Schema({
  averageNote: {
    type: Number,
    required: true
  },
  paysageNote: {
    type: Number,
    required: true
  },
  ambianceNote: {
    type: Number,
    required: true
  },
  difficultyNote: {
    type: Number,
    required: true
  }
})

const randoImageSchema = new Schema({
  source: String,
})

// create rando schema
const randoSchema = new Schema({
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
let RandoModel = mongoose.model('rando', randoSchema)

module.exports = RandoModel
export default RandoModel