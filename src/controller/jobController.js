import { postJob,jobSearch, findPostedJobsandApplications} from "../services/jobService.js";
import {catchReqResAsync} from '../utils/catchAsyn.js'

const createJob = catchReqResAsync(async(req,resp,next)=>{
    const newJob = await postJob(req.body);
    resp.status(201).json({
        status: 'success',
        data:{
            job: newJob
        }
    })
    
})

const searchJob = catchReqResAsync(async(req,resp,next)=>{
    const results = await jobSearch(req.body.jobTitle);
    resp.status(200).json({
        status: 'success',
        data:{
            jobs: results
        }
    })
    
})

const getJobsAndApplications = catchReqResAsync(async(req,resp,next)=>{
    let results = await findPostedJobsandApplications(req.params.jobId*1);
    resp.status(200).json({
        status: 'success',
        data:{
            jobs: results
        }
    })
    
})

export {createJob,searchJob,getJobsAndApplications}