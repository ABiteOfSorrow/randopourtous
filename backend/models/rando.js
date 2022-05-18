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
    city: Object,  //Ne pas oublier la log et lat
    coordinate: Object,
    maxUsers: Number,
    users: Array,
    estimation_time: Number,
    messages: [messageSchema],
    date: Date,
    description: String,
    evaluations: [evaluationsSchema],
    finished: Boolean,
    level: String,
    userId: String,
});

// link schema to collection
let rando = mongoose.model('rando', randoSchema);

module.exports = rando;