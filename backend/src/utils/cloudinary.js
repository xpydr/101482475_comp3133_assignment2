const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {String} imageData - Base64 encoded image string or file path
 * @param {String} folder - Optional folder name in Cloudinary
 * @returns {Promise<String>} - URL of uploaded image
 */
const uploadImage = async (imageData, folder = 'employee_photos') => {
  try {
    if (imageData.startsWith('data:image')) {
      const result = await cloudinary.uploader.upload(imageData, {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 500, height: 500, crop: 'limit' },
          { quality: 'auto' }
        ]
      });
      return result.secure_url;
    }
    
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      return imageData;
    }

    const result = await cloudinary.uploader.upload(imageData, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {String} imageUrl - URL of the image to delete
 */
const deleteImage = async (imageUrl) => {
  try {
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split('.')[0];
    const folder = urlParts[urlParts.length - 2];
    
    const fullPublicId = folder ? `${folder}/${publicId}` : publicId;
    
    await cloudinary.uploader.destroy(fullPublicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

module.exports = {
  uploadImage,
  deleteImage
};
