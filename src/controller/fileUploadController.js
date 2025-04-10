import {uploadLoadImage} from '../utils/cludinaryHelpers.js'
import {catchReqResAsync} from '../utils/catchAsyn.js'
import {recruiterUploadImg,userUploadImg} from '../services/uploadService.js'
import { AppError } from '../utils/appError.js';

export const imageUpload = catchReqResAsync(async (req, resp, next) => {

    if (!req.recruiter && !req.user) {
        return next(new AppError('Please login first!', 401));
    }   

    if (!req.file) {
        return next(new AppError('Please upload an image!', 400));
    }

    const filePath = req.file.path;

    const result = await uploadLoadImage(filePath).then((result) => {
        return result;
    }).catch((error) => {
        return next(new AppError('Image upload failed!', 500));
    });

    console.log(result);
     
    const id = req.recruiter? req.recruiter.id : req.user.id;

    console.log(id);

    const imgObj = {imageUrl: result.secure_url, publicId: result.public_id, id: id}
    let newImg;

    if(req.recruiter){
        newImg = await recruiterUploadImg(imgObj);
    }else{
        newImg = await userUploadImg(imgObj);
    }
    if(!newImg) {
        return next(new AppError('Unable to save image Url and public ID!', 417));
    }
    resp.status(200).json({
        status: 'success',
        data: {
            image: newImg
        }
    });

})
