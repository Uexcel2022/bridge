
import { createJobApp } from "../services/JobApplicationService.js";
import {catchReqResAsync} from '../utils/catchAsyn.js'

export const applyForJob = catchReqResAsync( async (req,resp,next)=>{
    const body = req.body;
    body.name = 'Uche Samuel'
    body.userId = 1
    body.jobId = req.params.id*1
    body.cv = 'udokaresume.pdf'
    body.phoneNumber = '07038253621'
    const newApp = await createJobApp(body);
    resp.status(201).json({
        status: 'success',
        data:{
            application: newApp
        }
    })
   
})