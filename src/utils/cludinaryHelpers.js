import {cloudinary} from './cloudinayConfig.js'

export const uploadLoadImage = async (filePath)=>{
    return await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(filePath, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}