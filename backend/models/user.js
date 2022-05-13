let mongoose = require('./connection');

// create track schema
let userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    name: String,
    lastname: String, 
    tracks: [], // use foreign key for tracks
});

// link schema to collection
let Track = mongoose.model('users', userSchema);

module.exports = Track;