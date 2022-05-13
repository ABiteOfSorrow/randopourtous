let mongoose = require('./connection');

// create track schema
let trackSchema = new mongoose.Schema({

});

// link schema to collection
let Track = mongoose.model('tracks', trackSchema);

// export model
module.exports = Track;