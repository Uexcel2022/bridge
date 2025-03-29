import { applyForJob } from '../controller/jobApplicationControler.js';
import express from 'express';
const jobAppRouter = express();

jobAppRouter.route('/:id')
.post(applyForJob)

export {jobAppRouter}