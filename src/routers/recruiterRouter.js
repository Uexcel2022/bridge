import express from 'express';
import {compUpdate,fetchCompanyByEmail,getMe,emailUpdate,
    phoneUpdate,deleteComp} from '../controller/recruiterController.js'
import {protectRecruiter,restrictRecruiterTo} from '../controller/recruiterAuthController.js'
import {recruiterRouter} from './recruiterAuthRouter.js'
const recruiterRouters = express.Router();

recruiterRouters.use('/auth',recruiterRouter)

recruiterRouters.use(protectRecruiter,restrictRecruiterTo('company'))
recruiterRouters.get('/me', getMe);
recruiterRouters.put('/update',compUpdate);
recruiterRouters.post('/email',fetchCompanyByEmail);
recruiterRouters.put('/email',emailUpdate);
recruiterRouters.put('/phone',phoneUpdate);
recruiterRouters.delete('/delete',deleteComp);

export{recruiterRouter};