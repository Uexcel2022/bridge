import { createJob,searchJob,getPostedJobs,getAllJobs,
    closeOrOpendJob,getClosedJobs,getJob,jobUpdate} from '../controller/jobController.js';
import {protectRecruiter,restrictRecruiterTo} from '../controller/recruiterAuthController.js'
import express from 'express'
const jobRouter = express.Router();

jobRouter.route('/search').get(searchJob)
jobRouter.route('/').get(getAllJobs)
.post(protectRecruiter,restrictRecruiterTo('recuriter'),createJob)

jobRouter.route('/one/:id').get(getJob)
.put(protectRecruiter,restrictRecruiterTo('recuriter'),jobUpdate)

jobRouter.use(protectRecruiter,restrictRecruiterTo('recuriter'));
jobRouter.route('/me').get(getPostedJobs);
jobRouter.route('/closed/:id').patch(closeOrOpendJob);
jobRouter.route('/closed').get(getClosedJobs);



export {jobRouter}
