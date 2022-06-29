var express = require('express');
var router = express.Router();
let bcrypt = require('bcrypt');
let uid = require('uid2');
let mongoose = require('mongoose');
let UserModel = require('../models/user');
//var RandoModel = require('../models/rando')
const cost = 10;

class UserController {

  async signup(req, res) {
    if (!req.body.email || !req.body.username || !req.body.password) {
      return res.json({ result: false, error: 'Input is missing.' })
    }
    // search if user already exists
    let alreadyUser = await UserModel.findOne({ email: req.body.email });
    if (alreadyUser) {
      return res.json({ result: false, error: "L'utilisateur existe déjà" })
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


  }

  async getMyData (req, res) {

  }

  async editProfile (req, res) {

  }

  async searchPeople (req, res) {

  }

  async addFriend (req, res) {

  }

  async getUserById (req, res) {

  }

}

module.exports = new UserController();