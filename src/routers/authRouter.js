import express from 'express'
import { signup, getMe,fetchUserByEmail,login,protect } from '../controller/authController.js'

const authRouter = express.Router()

authRouter.post('/signup',signup);
authRouter.route('/:id').get(getMe);
authRouter.post('/email',protect,fetchUserByEmail)
authRouter.post('/login',login)


export {authRouter}