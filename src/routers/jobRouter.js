import { createJob,searchJob,getJobsAndApplications } from '../controller/jobController.js';
import express from 'express'
const jobRouter = express.Router();

jobRouter.route('/')
.post(createJob)
.get(searchJob)

jobRouter.route('/:id')
.get(getJobsAndApplications)

export {jobRouter}
