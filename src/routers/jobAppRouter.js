import { applyForJob,fetchJobApplications,deleteAllJobApplications } from '../controller/jobApplicationControler.js';
import {protectCompany,restrictCompanyTo} from '../controller/companyAuthController.js'
import {protectUser,restrictUserTo} from '../controller/userAuthController.js'

import express from 'express';
const jobAppRouter = express.Router();

jobAppRouter.route('/:id')
.post(protectUser,restrictUserTo('user'),applyForJob)
.get(protectCompany,restrictCompanyTo('company'),fetchJobApplications)
.delete(protectCompany,restrictCompanyTo('company'),deleteAllJobApplications)


export {jobAppRouter}