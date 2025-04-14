import express from 'express'
import { imageUpload,resumeUpload } from '../controller/fileUploadController.js'
import {protect,restrictTo} from '../auth/auth.js'
import {sizeLimit} from '../utils/uploadMiddleware.js'
const uploadImgRouter = express.Router();
uploadImgRouter.use(protect,restrictTo('user','recruiter'),sizeLimit.single('image'))
uploadImgRouter.route('/').patch(imageUpload);


const uploadPdfRouter = express.Router();
uploadPdfRouter.use(protect,restrictTo('user'),sizeLimit.single('pdf')) 
uploadPdfRouter.route('/').patch(resumeUpload);

export {uploadImgRouter,uploadPdfRouter};