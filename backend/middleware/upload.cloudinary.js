/**
 * upload.cloudinary.js — Production upload middleware using Cloudinary
 *
 * SETUP:
 *   npm install cloudinary multer-storage-cloudinary
 *
 * Add to backend .env:
 *   CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   CLOUDINARY_API_KEY=your_api_key
 *   CLOUDINARY_API_SECRET=your_api_secret
 *
 * TO ACTIVATE FOR PRODUCTION:
 *   In backend/middleware/upload.js, replace the entire file content
 *   with the contents of this file.
 *   OR rename this file to upload.js before deploying.
 */

const cloudinary            = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer                = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'via_products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 800, crop: 'limit' }]  // auto-resize on upload
  }
});

module.exports = multer({ storage });
