import { postJob,jobSearch, findPostedJobs,findAllPostedJobs,
    clasedAndOpenJob,findCloseJobs,findJob,updateJob} from "../services/jobService.js";
import {catchReqResAsync} from '../utils/catchAsyn.js'
import {fieldFilter} from '../utils/firldsFilter.js'

export const createJob = catchReqResAsync(async(req,resp,next)=>{
    req.body.recruiter = req.recruiter.id;
    const newJob = await postJob(req.body);
    newJob.recruiter = await fieldFilter(newJob.recruiter)
    resp.status(201).json({
        status: 'success',
        data:{
            job:  newJob
        }
    })
    
})

export const searchJob = catchReqResAsync(async(req,resp,next)=>{
    const queryData = {page: req.query.page*1, limit: req.query.limit*1};
    queryData.title =  req.body.title;
    const res = await jobSearch(queryData);
    resp.status(200).json({
        status: 'success',
        results: res.length,
        data:{
            jobs: res
        }
    })
    
})

export const getPostedJobs = catchReqResAsync(async(req,resp,next)=>{
    const queryData = {page: req.query.page*1, limit: req.query.limit*1};
    queryData.id =  req.recruiter.id;
    const results = await findPostedJobs(queryData);
    resp.status(200).json({
        results: results.length,
        status: 'success',
        data:{
            jobs: results
        }
    })
    
})

export const getAllJobs = catchReqResAsync(async(req,resp,next)=>{
    const queryData = {page: req.query.page*1, limit: req.query.limit*1};
    const res = await findAllPostedJobs(queryData);
    resp.status(200).json({
        results: res.length,
        status: 'success',
        data:{
            jobs: res
        }
    })
    
})

export const closeOrOpendJob = catchReqResAsync(async(req,resp,next)=>{
    const updateData = {id: req.params.id, recruiterid: req.recruiter.id}
    await clasedAndOpenJob(updateData);
    resp.status(200).json({
        status: 'success',
        message: 'Request processed successfully!',
    })
    
})

export const getClosedJobs = catchReqResAsync(async(req,resp,next)=>{
    const res = await findCloseJobs(req.company.id);
    resp.status(200).json({
        results: res.length,
        status: 'success',
        data:{
            jobs: res
        }
    })
    
})

export const getJob = catchReqResAsync(async(req,resp,next)=>{
    const res = await findJob(req.params.id);
    resp.status(200).json({
        status: 'success',
        data:{
            jobs: res
        }
    })
    
})

export const jobUpdate = catchReqResAsync(async(req,resp,next)=>{
    const updateData = {id: req.params.id, recruiterid: req.recruiter.id, body: req.body}
    const res = await updateJob(updateData);
    resp.status(200).json({
        status: 'success',
        data:{
            job: res
        }
    })
    
})