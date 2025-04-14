import {addUserEmail,userEmailRemoval,updateAbout,
    nameUpdate,updatePhoneNumber,deleteOneUser} from '../controller/userController.js'
import express from 'express';
import {protect,restrictTo} from '../auth/auth.js'
import {userAuthRouter} from './userAuthRouter.js'
const userRouter = express();

userRouter.use('/auth',userAuthRouter)  

userRouter.use(protect,restrictTo('user'))

userRouter.patch('/email',addUserEmail);
userRouter.patch('/email/:index',userEmailRemoval);
userRouter.patch('/about',updateAbout);
userRouter.patch('/name',nameUpdate);
userRouter.patch('/phoneNumber',updatePhoneNumber)
userRouter.delete('/delete',deleteOneUser)

export {userRouter};