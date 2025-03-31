import express from 'express'
import { signup, getMe,fetchUserByEmail,
    login,protect,changePwd,forgetPassword,resetPassword } from '../controller/authController.js'

const authRouter = express.Router()

authRouter.post('/login',login)
authRouter.post('/signup',signup);
authRouter.post('/forgetPassword',forgetPassword)
authRouter.post('/resetPassword/:token',resetPassword)

authRouter.use(protect)

authRouter.get('/me',getMe);
authRouter.post('/email',fetchUserByEmail)
authRouter.post('/changePassword',changePwd)

export {authRouter}