let cloudinary = require("cloudinary").v2;
let fs = require("fs");
let uniqid = require("uniqid");

let randoModel = require('../models/rando');
let UserModel = require('../models/user');

// cloudinary for upload photos
cloudinary.config({
  cloud_name: "rupo",
  api_key: "844975946581267",
  api_secret: "vxmNTX3GRyB5KMi8xWp9IM8u2zs",
});

class IndexController {

  async createTrack (req, res) {

  }

  async getTrackById (req, res) {

  }

  async getTracks (req, res) {

  }

  async searchTrack(req, res) {

  }

  async uploadPhoto (req, res) {

  }

  async addUserToTrack (req, res) {

  }

  async finishTrack (req, res) {

  }

  async updateTrackRating (req, res) {

  }

  async getFinishedTrackInfo (req, res) {
    
  }

}

module.exports = new IndexController();