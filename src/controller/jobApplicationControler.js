
import { jobApp } from "../services/JobApplicationService.js";

export const applyForJob = async (req,resp,next)=>{
    try{
        const body = req.body;
        body.phoneNumber ='182922920020';
        body.name = 'jame brown';
        body.cv = '/cv/id/jamecv.pdf';
        body.jobId = 1;
        body.userId = 5;
        const newApp = await jobApp(body);
        resp.status(201).json({
            status: 'success',
            data:{
                application: newApp
            }
        })
    }catch(err){
        console.log(err)
        throw new Error(err);
    }

}