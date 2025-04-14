import express from 'express'
import {changePwd,recruiterLogin,
    recruiterSignup,forgotPassword,resetPassword} from '../controller/recruiterAuthController.js'
import {protect,restrictTo} from '../auth/auth.js'

const recruiterAuthRouter = express.Router()

recruiterAuthRouter.post('/login',recruiterLogin);
recruiterAuthRouter.post('/signup',recruiterSignup);
recruiterAuthRouter.post('/forgetPassword',forgotPassword)
recruiterAuthRouter.post('/resetPassword/:token',resetPassword)

recruiterAuthRouter.use(protect,restrictTo('recruiter'))
recruiterAuthRouter.post('/changePassword',changePwd)

export {recruiterAuthRouter}