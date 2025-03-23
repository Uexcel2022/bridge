import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const postJob = async(job)=>{
    try{
        const newJob = await  prisma.jobs.create({
            data:{
                company: job.company,
                summary: job.summary,
                photo: job.photo,
                jobDetails: job.jobDetails,
                createdAt: new Date(Date.now()),
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