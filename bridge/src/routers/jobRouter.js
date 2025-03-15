import { createJob } from '../controller/jobController.js';
import express from 'express'
const jobRouter = express.Router();

jobRouter.route('/')
.post(createJob);

export {jobRouter}
