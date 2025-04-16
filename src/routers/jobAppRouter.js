import { applyForJob,fetchJobApplications,deleteAllJobApplications } from '../controller/jobApplicationControler.js';
import {protect,restrictTo} from '../auth/auth.js'

import express from 'express';
const jobAppRouter = express.Router();

jobAppRouter.route('/:id')
.post(protect,restrictTo('user'),applyForJob)
.get(protect,restrictTo('recruiter'),fetchJobApplications)
.delete(protect,restrictTo('recruiter'),deleteAllJobApplications)


export {jobAppRouter}