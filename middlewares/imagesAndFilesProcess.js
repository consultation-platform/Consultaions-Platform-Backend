const multer = require("multer");
const path = require("path");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

exports.uploadMixOfImages = (fields) => upload.fields(fields);
exports.uploadSingleImage = (field) => upload.single(field);

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRETE_KEY,
  },
  region: process.env.AWS_REGION,
});
async function uploadToS3(buffer, fileName, folder, contentType) {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${folder}/${fileName}`,
    Body: buffer,
    ACL: "public-read",
    ContentType: contentType,
  };

  await s3Client.send(new PutObjectCommand(params));
}

exports.saveFilesNameToDB = asyncHandler(async (req, res, next) => {
  try {
    const hostname = ``;

    //Image(1) processing
    if (req.files.image && req.files.image.length > 0) {
      const imageFileName = `${Date.now()}-${slugify(
        req.files.image[0].originalname
      )}`;
      // Upload image to AWS S3 in the "images" folder
      await uploadToS3(
        req.files.image[0].buffer,
        imageFileName,
        "images",
        "image/jpeg"
      );

      req.body.image = `${hostname}/images/${imageFileName}`;
    }

    // Process video
    if (req.files.video && req.files.video.length > 0) {
      const videoFileName = `${Date.now()}-${slugify(
        req.files.video[0].originalname
      )}`;
      await uploadToS3(
        req.files.video[0].buffer,
        videoFileName,
        "videos",
        "video/mp4"
      );
      req.body.video = `${hostname}/videos/${videoFileName}`;
    }

    // Process other files
    if (req.files.pdf && req.files.pdf.length > 0) {
      const fileFileName = `${Date.now()}-${slugify(
        req.files.pdf[0].originalname
      )}`;
      await uploadToS3(
        req.files.pdf[0].buffer,
        fileFileName,
        "files",
        "application/pdf"
      );
      req.body.pdf = `${hostname}/files/${fileFileName}`;
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
});
