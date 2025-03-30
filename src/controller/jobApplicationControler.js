
import { createJobApp, getJobApplications} from "../services/JobApplicationService.js";
import { AppError } from "../utils/appError.js";
import {catchReqResAsync} from '../utils/catchAsyn.js'

export const applyForJob = catchReqResAsync( async (req,resp,next)=>{
    const body = req.body;
    body.name = `${req.user.firstName} ${req.user.middleName}`
    body.userId = req.user.id
    body.jobId = req.params.id*1
    body.cv = req.user.firstName+'.pdf'
    body.phoneNumber = req.user.phoneNumber
    const newApp = await createJobApp(body);
    resp.status(201).json({
        status: 'success',
        data:{
            application: newApp
        }
    })
   
})

export const fetchJobApplications = catchReqResAsync(async (req,resp,next)=>{
    const results = await getJobApplications(req.params.id*1);
    resp.status(200).json({
        status: 'success',
        data:{
         results
        }
    })
})