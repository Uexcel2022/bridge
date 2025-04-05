import { createJob,searchJob,getPostedJobs,getAllJobs,
    closeOrOpendJob,getClosedJobs,getJob,jobUpdate} from '../controller/jobController.js';
import {protectCompany,restrictCompanyTo} from '../controller/companyAuthController.js'
import express from 'express'
const jobRouter = express.Router();

jobRouter.route('/search').get(searchJob)
jobRouter.route('/').get(getAllJobs)
.post(protectCompany,restrictCompanyTo('company'),createJob)

jobRouter.route('/one/:id').get(getJob)
.put(protectCompany,restrictCompanyTo('company'),jobUpdate)

jobRouter.use(protectCompany,restrictCompanyTo('company'));
jobRouter.route('/me').get(getPostedJobs);
jobRouter.route('/closed/:id').patch(closeOrOpendJob);
jobRouter.route('/closed').get(getClosedJobs);



export {jobRouter}
