import { createJob,searchJob,getPostedJobs } from '../controller/jobController.js';
import {protect,restrictTo} from '../controller/authController.js'
import express from 'express'
const jobRouter = express.Router();

jobRouter.route('/').get(searchJob)
.post(protect,restrictTo('employer'),createJob);

jobRouter.route('/posted').get(protect,getPostedJobs)


export {jobRouter}
