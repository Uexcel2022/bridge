import express from 'express'
import {changePwd,companyLogin,protectCompany,restrictCompanyTo,
    companySignup,forgetPassword,resetPassword} from '../controller/companyAuthController.js'

const companyAuthRouter = express.Router()

companyAuthRouter.post('/login',companyLogin);
companyAuthRouter.post('/signup',companySignup);
companyAuthRouter.post('/forgetPassword',forgetPassword)
companyAuthRouter.post('/resetPassword/:token',resetPassword)

companyAuthRouter.use(protectCompany,restrictCompanyTo('company'))
companyAuthRouter.post('/changePassword',changePwd)

export {companyAuthRouter}