import express from 'express'
import { signupUser, getMe,fetchUserByEmail,
    loginUser,changePwd,forgetPassword,resetPassword} from '../controller/userAuthController.js'
import {protect,restrictTo} from '../auth/auth.js'

const userAuthRouter = express.Router()

userAuthRouter.post('/login',loginUser)
userAuthRouter.post('/signup',signupUser);
userAuthRouter.post('/forgetPassword',forgetPassword)
userAuthRouter.post('/resetPassword/:token',resetPassword)

userAuthRouter.use(protect,restrictTo('user'))

userAuthRouter.get('/me',getMe);
userAuthRouter.post('/email',fetchUserByEmail)
userAuthRouter.post('/changePassword',changePwd)

export {userAuthRouter}