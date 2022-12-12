let mongoose = require('./connection');

// create track schema
let userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    name: String,
    lastname: String,
    age: Number,
    averageRating: Number,
    createdAccount: Date,
    token: String,
    friends: [],
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'rando' }], // use foreign key for tracks
});

// link schema to collection
let Track = mongoose.model('users', userSchema);

module.exports = Track;
export default Track
