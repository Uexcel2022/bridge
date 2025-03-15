import { PrismaClient } from "@prisma/client";
import { join } from "@prisma/client/runtime/library";
const prisma = new PrismaClient();

export const postJob = async(job)=>{
    try{
        const newJob = await  prisma.jobs.create({
            data:{
                company: job.company,
                summary: job.summary,
                photo: job.photo,
                jobDetails: job.jobDetails,
                email: job.email,
                user: {
                  connect: {id: job.userId},
                }
            },
            include:{
                user: true
            }
        })
        return newJob;

    }catch(err){
        console.log(err);
        throw err
    }
}