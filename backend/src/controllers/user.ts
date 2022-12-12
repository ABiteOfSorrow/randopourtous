let bcrypt = require('bcrypt');
let uid = require('uid2');
let mongoose = require('../models/connection');
let UserModel = require('../models/user');
const cost = 10;

class UserController {

  async signup(req, res) {
    if (!req.body.email || !req.body.username || !req.body.password) {
      return res.json({ result: false, error: 'Input is missing.' })
    }
    // search if user already exists
    let alreadyUser = await UserModel.findOne({ email: req.body.email });
    if (alreadyUser) {
      return res.json({ result: false, error: "User already exists." })
    }
    const hash = bcrypt.hashSync(req.body.password, cost);
    let user = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      name: '',
  
      lastname: '',
      averageRating: -1,
      age: -1,
      createdAccount: new Date(),
      token: uid(32),
      tracks: []
    });
    let savedUser = await user.save();
    if (savedUser) {
      return res.json({ result: true, user: savedUser })
    }
    return res.json({ result: false, error: 'Error while saving user.' })
  }

  async signin(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.json({ result: false, error: 'Missing input data.' })
    }
    let foundUser = await UserModel.findOne({ email: req.body.email })
    if (!foundUser) {
      return res.json({ result: false, error: 'User does not exist.' })
    }
    if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
      return res.json({ result: false, error: 'Wrong password.' })
    }
    return res.json({ result: true, user: foundUser })
  }

  async getMyData(req, res) {
    if (!req.query.token) return res.json({ result: false, error: 'Token is missing.' })
    // search user in db by token
    let foundUser = await UserModel.findOne({ token: req.query.token });
    if (!foundUser) {
      return res.json({ result: false, error: 'User not found.' })
    }
    return res.json({ result: true, user: foundUser })
  }

  async editProfile(req, res) {
    if (!req.body.token) {
      return res.json({ result: false, error: 'Token is missing.' })
    }
    // search user in db by token
    let foundUser = await UserModel.findOne({ token: req.body.token });
    if (!foundUser) {
      return res.json({ result: false, error: 'Bad token.' })
    }
    if (typeof req.body.name !== 'string' || typeof req.body.lastname !== 'string' || typeof req.body.age !== 'string') {
      return res.json({ result: false, error: 'Bad data.' })
    }
    let age = req.body.age
    if (!age) age = -1
    else age = parseInt(age)

    let name = req.body.name.toString();
    let lastname = req.body.lastname.toString();
    foundUser.name = name;
    foundUser.lastname = lastname;
    foundUser.age = age;
    try {
      let savedUser = await foundUser.save();
      if (savedUser) return res.json({ result: true, user: savedUser })
      else return res.json({ result: false, error: 'Erreur lors de la sauvegarde.', user: foundUser });
    } catch (error) {
      return res.json({ result: false, error: 'Erreur lors de la sauvegarde.', user: foundUser });
    }
  }

  async searchPeople(req, res) {
    if (!req.query.username) {
      return res.json({ result: false, error: "Il manque le nom d'utisateur." });
    }
    let foundUsers;
    try {
      foundUsers = await UserModel.find({ username: req.query.username }).populate('tracks').exec();
    } catch (error) {
      console.log(error);
      return res.json({ result: false, error: "Erreur lors de la recherche." });
    }
    let cleanUsers: any[] = [];
    foundUsers.forEach(user => {
      cleanUsers.push({
        _id: user._id,
        username: user.username,
        name: user.name,
        lastname: user.lastname,
        age: user.age,
        averageRating: user.averageRating,
        createdAccount: user.createdAccount,
        tracks: user.tracks,
        friends: user.friends
      })
    })
    return res.json({ result: true, users: cleanUsers });
  }

  async addFriend(req, res) {
    if (!req.body.token || !req.body.username) {
      return res.json({ result: false, error: "Le token ou le nom d'utilisateur est manquant." });
    }
    try {
      let foundUser = await UserModel.findOne({ token: req.body.token }).catch(e => {
        console.error(e);
        return null;
      });
      if (!foundUser)return res.json({ result: false, error: 'User not found.' });
      
      let foundFriend = await UserModel.findOne({ username: req.body.username }).catch(e => {
        console.error(e);
        return null;
      });
      if (!foundFriend) {
        return res.json({ result: false, error: 'Requested friend not found.' });
      }
      // check if not already friends
      if (foundUser.friends.includes(foundFriend._id)) {
        return res.json({ result: false, error: 'You are already friends.' });
      }
      foundUser.friends.push(foundFriend._id);
      await foundUser.save().catch(e => {
        console.error(e);
        return res.json({ result: false, error: "" })
      });
      return res.json({ result: true, user: foundUser });
    } catch (error) {
      console.log(error)
      return res.json({ result: false, error: "Une erreur du serveur est survenue." });
    }
  }

  async getUserById (req, res) {
    if (!req.params.id) {
      return res.json({ result: false, error: 'Missing user id.' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ result: false, error: 'Not valid user id.' });
    }
    let foundUser = await UserModel.findById(req.params.id).populate('tracks').exec();
    if (!foundUser) {
      return res.json({ result: false, error: 'User not found by id.' });
    }
    let cleanUser = {
      _id: foundUser._id,
      username: foundUser.username,
      name: foundUser.name,
      lastname: foundUser.lastname,
      age: foundUser.age,
      averageRating: foundUser.averageRating,
      createdAccount: foundUser.createdAccount,
      tracks: foundUser.tracks,
      friends: foundUser.friends
    }
    return res.json({ result: true, user: cleanUser });
  }

}

module.exports = new UserController();
export default new UserController();
