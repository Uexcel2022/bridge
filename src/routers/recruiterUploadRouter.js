import express from 'express'
import {imageUpload } from '../controller/fileUploadController.js'
import {protectRecruiter,restrictRecruiterTo} from '../controller/recruiterAuthController.js'
import {sizeLimit} from '../utils/uploadMiddleware.js'
const recruiterUploadRouter = express.Router();

recruiterUploadRouter.use(protectRecruiter,restrictRecruiterTo('recruiter'),sizeLimit.single('image'))
recruiterUploadRouter.route('/').post(imageUpload);

export {recruiterUploadRouter};