import { applyForJob,fetchJobApplications } from '../controller/jobApplicationControler.js';
import {protect,restrictTo} from '../controller/authController.js'

import express from 'express';
const jobAppRouter = express();

jobAppRouter.route('/:id')
.post(protect,applyForJob)
.get(protect,restrictTo('employer'),fetchJobApplications)

export {jobAppRouter}