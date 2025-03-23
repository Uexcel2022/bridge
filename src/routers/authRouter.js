import express from 'express'
import { signup } from '../controller/authController.js'

const authRouter = express.Router()

authRouter.route('/').post(signup);

export {authRouter}