import cloudinaryGlobal from "cloudinary"

const cloudinary = cloudinaryGlobal.v2

// cloudinary for upload photos
cloudinary.config({
    cloud_name: "rupo",
    api_key: process.env.ApiKey,
    api_secret: process.env.ApiSecret,
});

module.exports = cloudinary;