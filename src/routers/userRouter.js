import {addUserEmail,userEmailRemoval,updateAbout,
    nameUpdate,updatePhoneNumber,updatePhoto,removeCv,uploadCv,deleteOneUser} from '../controller/userController.js'
import express from 'express';
import {protectUser,restrictUserTo} from '../controller/userAuthController.js'

const userRouter = express();

userRouter.use(protectUser,restrictUserTo('user'))

userRouter.patch('/email',addUserEmail);
userRouter.patch('/email/:index',userEmailRemoval);
userRouter.patch('/about',updateAbout);
userRouter.patch('/name',nameUpdate);
userRouter.patch('/phoneNumber',updatePhoneNumber)
userRouter.patch('/photo',updatePhoto)
userRouter.patch('/cv',uploadCv)
userRouter.patch('/cv/:index',removeCv)
userRouter.delete('/delete',deleteOneUser)

export {userRouter};