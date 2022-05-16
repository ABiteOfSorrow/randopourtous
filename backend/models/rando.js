let mongoose = require('./connection');

var messageSchema = mongoose.Schema({
    id: Number,
    author: String,
    content: String,
 });

 var evaluationsSchema = mongoose.Schema({
    note: Number,
 });

// create rando schema
let randoSchema = new mongoose.Schema({
    id: Number,
    mixed: Boolean,
    name: String,
    departure: Object,  //Ne pas oublier la log et lat
    arrival: Object,       //Ne pas oublier la log et lat
    maxRunner: Number,
    estimation_time: String,
    running_time: String,
    messages: [messageSchema],
    date: String,
    description: String,
    evaluations: [evaluationsSchema],
    finished: Boolean,
    level: String,
    tokenCreator: String,
});

// link schema to collection
let rando = mongoose.model('rando', randoSchema);

module.exports = rando;