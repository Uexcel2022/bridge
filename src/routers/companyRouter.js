import express from 'express';
import {compUpdate,fetchCompanyByEmail,getMe,emailUpdate,phoneUpdate} from '../controller/companyController.js'
import {protectCompany,restrictCompanyTo} from '../controller/companyAuthController.js'
import {companyAuthRouter} from './companyAuthRouter.js'
const companyRouter = express.Router();

companyRouter.use('/auth',companyAuthRouter)

companyRouter.use(protectCompany,restrictCompanyTo('company','admin'))
companyRouter.get('/me', getMe)
companyRouter.put('/update',compUpdate)
companyRouter.post('/email',fetchCompanyByEmail)
companyRouter.put('/email',emailUpdate)
companyRouter.put('/phone',phoneUpdate)

export{companyRouter};