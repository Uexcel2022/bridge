import express from 'express'
import { signupUser, getMe,fetchUserByEmail,
    loginUser,protectUser,changePwd,forgetPassword,resetPassword, 
    restrictUserTo} from '../controller/userAuthController.js'

const userAuthRouter = express.Router()

userAuthRouter.post('/login',loginUser)
userAuthRouter.post('/signup',signupUser);
userAuthRouter.post('/forgetPassword',forgetPassword)
userAuthRouter.post('/resetPassword/:token',resetPassword)

userAuthRouter.use(protectUser,restrictUserTo('user'))

userAuthRouter.get('/me',getMe);
userAuthRouter.post('/email',fetchUserByEmail)
userAuthRouter.post('/changePassword',changePwd)

export {userAuthRouter}