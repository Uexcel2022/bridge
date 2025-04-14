import express from 'express';
import {recruiterUpdate,fetchRecruiterByEmail,getMe,emailUpdate,
    phoneUpdate,deleRecruiter} from '../controller/recruiterController.js'
import {recruiterAuthRouter} from './recruiterAuthRouter.js'
import  {protect,restrictTo} from '../auth/auth.js'
const recruiterRouter = express.Router();

recruiterRouter.use('/auth',recruiterAuthRouter)

recruiterRouter.use(protect,restrictTo('recruiter'))

recruiterRouter.get('/me', getMe);
recruiterRouter.put('/update',recruiterUpdate);
recruiterRouter.post('/email',fetchRecruiterByEmail);
recruiterRouter.put('/email',emailUpdate);
recruiterRouter.put('/phone',phoneUpdate);
recruiterRouter.delete('/delete',deleRecruiter);

export{recruiterRouter};