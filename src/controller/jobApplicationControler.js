
import { createJobApp, getJobApplications,deleteJobApplications} from "../services/JobApplicationService.js";
import {catchReqResAsync} from '../utils/catchAsyn.js'
export const applyForJob = catchReqResAsync( async (req,resp,next)=>{
    //would have to send below info from from end will applying for a job
    const body = req.body;
    body.phoneNumber = req.body.phoneNumber;
    body.name = req.body.name;
    body.userId = req.user.id;
    body.jobId = req.params.id;
    body.cv = req.body.cv;
    body.coverLetter = req.body.coverLetter;
    
    const newApp = await createJobApp(body);
    
    resp.status(201).json({
        status: 'success',
        data:{
            application: newApp
        }
    })
   
})

export const fetchJobApplications = catchReqResAsync(async (req,resp,next)=>{
    const queryData = {page: req.query.page*1, limit: req.query.limit*1};
    queryData.id =  req.params.id;
    const results = await getJobApplications(queryData);
    resp.status(200).json({
        results: results.length,
        status: 'success',
        data:{
         results
        }
    })
})


export const deleteAllJobApplications = catchReqResAsync(async (req,resp,next)=>{
      await deleteJobApplications(req.params.id)
    resp.status(204).json({
        status: 'success',
        data:{
         result: null
        }
    })
})