import {uploadLoadImage} from '../utils/cludinaryHelpers.js'
import {catchReqResAsync} from '../utils/catchAsync.js'
import {recruiterUploadImg,userUploadImg,uploadResume,
    deleteImageUser,deleteImageRecruiter} from '../services/uploadService.js'
import { AppError } from '../utils/appError.js';
import fs from 'fs'

export const imageUpload = catchReqResAsync(async (req, resp, next) => {

    if (!req.recruiter && !req.user) {
        return next(new AppError('Please login first!', 401));
    }   

    if (!req.file) {
        return next(new AppError('Please upload an file!', 400));
    }

    const filePath = req.file.path;

    const result = await uploadLoadImage(filePath).then((result) => {
        return result;
    }).catch((error) => {
        return next(new AppError('upload failed!', 500));
    });
     
    const id = req.recruiter? req.recruiter.id : req.user.id;

    const fileData = {imageUrl: result.secure_url, publicId: result.public_id, id: id}
    let newImg;

    if(req.recruiter){
        newImg = await recruiterUploadImg(fileData);
    }else{
        newImg = await userUploadImg(fileData);
    }
    
    // fs.unlinkSync(filePath);

    if(!newImg) {
        return next(new AppError('Unable to save file Url and public ID!', 417));
    }
    resp.status(200).json({
        status: 'success',
        data: {
            image: newImg
        }
    });

})


export const resumeUpload = catchReqResAsync(async (req, resp, next) => {

    if (!req.user) {
        return next(new AppError('Please login first!', 401));
    }   

    if (!req.file) {
        return next(new AppError('Please upload an file!', 400));
    }

    const filePath = req.file.path;

    const result = await uploadLoadImage(filePath).then((result) => {
        return result;
    }).catch((error) => {
        return next(new AppError('Upload failed!', 500));
    });
     
    const id =  req.user.id;

    const pfdFileObj = {imageUrl: result.secure_url, publicId: result.public_id, id: id}

    const pfdFile = await uploadResume(pfdFileObj);
    
    // fs.unlinkSync(filePath);

    if(!pfdFile) {
        return next(new AppError('Unable to save file Url and public ID!', 417));
    }
    resp.status(200).json({
        status: 'success',
        data: {
            pfdFile
        }
    });
})

export const deleteImg = catchReqResAsync(async (req,resp,next) =>{
    
    const id = req.user? req.user.id : req.recruiter.id
    let doc;
    if(req.user){
       doc  = await deleteImageUser(id);
    }else{
        doc = await deleteImageRecruiter(id);
    }
    resp.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
})