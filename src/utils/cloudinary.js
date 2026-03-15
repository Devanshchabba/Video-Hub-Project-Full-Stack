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
            })
        // console.log("File uploaded successfully to Cloudinary");
        // console.log(uploadResult.url)
        // console.log(uploadResult)
        fs.unlinkSync(localFile)
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localFile); // Delete the local file if upload fails
        console.error('Error uploading file to Cloudinary:', error);
    };
}
export default cloudinaryUpload


