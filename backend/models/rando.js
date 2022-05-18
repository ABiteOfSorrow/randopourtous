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
    mixed: Boolean,
    name: String,
    departure: Object,  //Ne pas oublier la log et lat
    latitude: Number,
    longitude: Number,
    maxRunner: Number,
    nbRunner: Number,
    estimation_time: Number,
    messages: [messageSchema],
    date: String,
    description: String,
    evaluations: [evaluationsSchema],
    finished: Boolean,
    level: String,
    userToken: String,
});

// link schema to collection
let rando = mongoose.model('rando', randoSchema);

module.exports = rando;