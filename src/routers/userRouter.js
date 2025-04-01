import {addUserEmail,userEmailRemoval,updateAbout,
    nameUpdate,updatePhoneNumber,updatePhoto,removeCv,uploadCv} from '../controller/userController.js'
import express from 'express';
import {protect,restrictTo} from '../controller/authController.js'

const userRouter = express();

userRouter.use(protect,restrictTo('user','employer'))

userRouter.patch('/email',addUserEmail);
userRouter.patch('/email/:index',userEmailRemoval);
userRouter.patch('/about',updateAbout);
userRouter.patch('/name',nameUpdate);
userRouter.patch('/phoneNumber',updatePhoneNumber)
userRouter.patch('/photo',updatePhoto)
userRouter.patch('/cv',uploadCv)
userRouter.patch('/cv/:index',removeCv)


export {userRouter};