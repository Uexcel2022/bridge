import express from 'express'
import { signup, getMe,fetchUserByEmail,login,protect,changePwd } from '../controller/authController.js'

const authRouter = express.Router()

authRouter.post('/signup',signup);
authRouter.get('/me', protect,getMe);
authRouter.post('/email',protect,fetchUserByEmail)
authRouter.post('/login',login)
authRouter.post('/changePassword',protect,changePwd)


export {authRouter}