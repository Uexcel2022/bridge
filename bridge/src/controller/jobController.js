import { postJob } from "../services/jobService.js";

export const createJob = async(req,resp,next)=>{
    try{
        const newJob = await postJob(req.body);
        resp.status(201).json({
            status: 'success',
            data:{
                job: newJob
            }
        })
    }catch(err){
        console.log(err)
        throw err
    }
}