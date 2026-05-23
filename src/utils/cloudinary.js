import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ // very important step 
    path: './.env'
})
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const cloudinaryUpload = async (localFile) => {
    try {
        if (!localFile) {
            console.error("No file provided for upload");
            return null;
        }
        const uploadResult = await cloudinary.uploader.upload(localFile, {
            resource_type: 'auto',
            // Automatically detect the resource type (image, video, etc.)
        });
        fs.unlinkSync(localFile);
        return uploadResult;
    } catch (error) {
        if (localFile && fs.existsSync(localFile)) {
            fs.unlinkSync(localFile); // Delete the local file if upload fails
        }
        console.error('Error uploading file to Cloudinary:', error);
        return null;
    }
};

export const uploadFilesToCloudinary = async (files = []) => {
    if (!Array.isArray(files) || !files.length) return [];

    const uploadPromises = files.map(async (file) => {
        const filePath = file?.path || file;
        if (!filePath) return null;
        const result = await cloudinaryUpload(filePath);
        return result?.secure_url || null;
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(Boolean);
};

export default cloudinaryUpload


