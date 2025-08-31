const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // imported module from cloudinary js

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "FullStack Blog Post",
    allowedFormats: ["gif", "jpg", "png"],
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
