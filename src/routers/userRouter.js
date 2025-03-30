import {addUserEmail,userEmailRemoval,updateAbout} from '../controller/userController.js'
import express from 'express';
import {protect,restrictTo} from '../controller/authController.js'

const userRouter = express();

userRouter.use(protect,restrictTo('user','employer'))

userRouter.patch('/email/add',addUserEmail);
userRouter.patch('/email/remove',userEmailRemoval);
userRouter.patch('/about',updateAbout)


export {userRouter};