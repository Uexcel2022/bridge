import express from 'express'
import { signup, getMe,fetchUserByEmail,
    login,protect,changePwd } from '../controller/authController.js'

const authRouter = express.Router()

authRouter.post('/login',login)
authRouter.post('/signup',signup);

authRouter.use(protect)

authRouter.get('/me',getMe);
authRouter.post('/email',fetchUserByEmail)
authRouter.post('/changePassword',changePwd)

export {authRouter}