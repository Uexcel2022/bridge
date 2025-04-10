import express from 'express'
import { imageUpload } from '../controller/fileUploadController.js'
import {protectUser,restrictUserTo} from '../controller/userAuthController.js'
import {sizeLimit} from '../utils/uploadMiddleware.js'
const userUploadRouter = express.Router();
userUploadRouter.use(protectUser,restrictUserTo('user'),sizeLimit.single('image'))
userUploadRouter.route('/').post(imageUpload);

export {userUploadRouter}