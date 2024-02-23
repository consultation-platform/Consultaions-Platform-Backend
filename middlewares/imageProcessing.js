const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

exports.saveSingleImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageName = `${Date.now()}-${slugify(req.file.originalname)}`;

    // Upload image to AWS S3 in the "images" folder
    await uploadToS3(req.file.buffer, imageName, "images");

    // Save image into our db
    req.body.image = imageName;
  }

  next();
});

async function uploadToS3(buffer, fileName, folder) {
  const params = {
    Bucket: "cambridge-files-repository",
    Key: `${folder}/${fileName}`,
    Body: buffer,
    ACL: "public-read",
    ContentType: "image/jpeg",
  };

  // Use S3 client to send the upload request
  await s3Client.send(new PutObjectCommand(params));
}
