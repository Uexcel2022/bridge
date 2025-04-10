import { applyForJob,fetchJobApplications,deleteAllJobApplications } from '../controller/jobApplicationControler.js';
import {protectRecruiter,restrictRecruiterTo} from '../controller/recruiterAuthController.js'
import {protectUser,restrictUserTo} from '../controller/userAuthController.js'

import express from 'express';
const jobAppRouter = express.Router();

jobAppRouter.route('/:id')
.post(protectUser,restrictUserTo('user'),applyForJob)
.get(protectRecruiter,restrictRecruiterTo('recruiter'),fetchJobApplications)
.delete(protectRecruiter,restrictRecruiterTo('recruiter'),deleteAllJobApplications)


export {jobAppRouter}