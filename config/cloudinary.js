const cloudinary = require("cloudinary").v2;

cloudinary.config({
  api_key: process.env.cloudinary_apiKey,
  cloud_name: process.env.cloudinary_cloudname,
  api_secret: process.env.cloudinary_apiSecret,
});

module.exports = cloudinary;