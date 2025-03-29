import { createJob,searchJob,getJobsAndApplications } from '../controller/jobController.js';
import {protect,restrictTo} from '../controller/authController.js'
import express from 'express'
const jobRouter = express.Router();

jobRouter.route('/')
.post(createJob)
.get(searchJob)

jobRouter.use(protect,restrictTo('employer'))
jobRouter.route('/:jobId')
.get(getJobsAndApplications)

export {jobRouter}
