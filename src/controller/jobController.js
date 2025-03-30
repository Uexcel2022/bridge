import { postJob,jobSearch, findPostedJobs} from "../services/jobService.js";
import {catchReqResAsync} from '../utils/catchAsyn.js'

const createJob = catchReqResAsync(async(req,resp,next)=>{
    req.body.userId = req.user.id;
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

const getPostedJobs = catchReqResAsync(async(req,resp,next)=>{
    let results = await findPostedJobs(req.user.id);
    
    resp.status(200).json({
        status: 'success',
        data:{
            jobs: results
        }
    })
    
})

export {createJob,searchJob,getPostedJobs}