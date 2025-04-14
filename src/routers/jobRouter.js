import { createJob,searchJob,getPostedJobs,getAllJobs,
    closeOrOpendJob,getClosedJobs,getJob,jobUpdate} from '../controller/jobController.js';
import {protect,restrictTo} from '../auth/auth.js'
import {jobAppRouter} from './jobAppRouter.js'

import express from 'express'
const jobRouter = express.Router();

jobRouter.use('/application',jobAppRouter);

jobRouter.route('/search').get(searchJob)
jobRouter.route('/').get(getAllJobs)
.post(protect,restrictTo('recruiter'),createJob)

jobRouter.route('/one/:id').get(getJob)
.put(protect,restrictTo('recruiter'),jobUpdate)

jobRouter.use(protect,restrictTo('recruiter'));
jobRouter.route('/me').get(getPostedJobs);
jobRouter.route('/closed/:id').patch(closeOrOpendJob);
jobRouter.route('/closed').get(getClosedJobs);



export {jobRouter}
