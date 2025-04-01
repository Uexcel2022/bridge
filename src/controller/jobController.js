import { postJob,jobSearch, findPostedJobs} from "../services/jobService.js";
import {catchReqResAsync} from '../utils/catchAsyn.js'

export const createJob = catchReqResAsync(async(req,resp,next)=>{
    req.body.userId = req.user.id;
    const newJob = await postJob(req.body);
    resp.status(201).json({
        status: 'success',
        data:{
            job: newJob
        }
    })
    
})

export const searchJob = catchReqResAsync(async(req,resp,next)=>{
    const results = await jobSearch(req.body.jobTitle);
    resp.status(200).json({
        status: 'success',
        data:{
            jobs: results
        }
    })
    
})

export const getPostedJobs = catchReqResAsync(async(req,resp,next)=>{
    let results = await findPostedJobs(req.user.id);
    
    resp.status(200).json({
        status: 'success',
        data:{
            jobs: results
        }
    })
    
})

