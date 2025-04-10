import express from 'express'
import {changePwd,recruiterLogin,protectRecruiter,restrictRecruiterTo,
    recruiterSignup,forgetPassword,resetPassword} from '../controller/recruiterAuthController.js'

const recruiterRouter = express.Router()

recruiterRouter.post('/login',recruiterLogin);
recruiterRouter.post('/signup',recruiterSignup);
recruiterRouter.post('/forgetPassword',forgetPassword)
recruiterRouter.post('/resetPassword/:token',resetPassword)

recruiterRouter.use(protectRecruiter,restrictRecruiterTo('recruiter'))
recruiterRouter.post('/changePassword',changePwd)

export {recruiterRouter}