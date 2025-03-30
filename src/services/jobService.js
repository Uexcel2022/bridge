import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {catchDBAsync} from '../utils/catchAsyn.js'

const postJob = catchDBAsync( async(job)=>{
    const newJob = await  prisma.jobs.create({
        data:{
            company: job.company,
            jobTitle: job.jobTitle,
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
})

const jobSearch = catchDBAsync(async(val)=>{
    const rs = await prisma.jobs.findMany(
        {where: {
            jobTitle:{
                contains: val,
                mode: 'insensitive'
            }
        },
        include: {user: true},
    })
   return rs;
})




const findPostedJobs = catchDBAsync(async(id)=>{
    const rs = await prisma.jobs.findMany(
        { where: {
            userId : id
        },
    })
   return rs;
})


const findAllPostedJobs = catchDBAsync(async(id)=>{
    const rs = await prisma.jobs.findMany(
        { where: {
            userId : id
        },
    })
   return rs;
})


export {postJob,jobSearch,findPostedJobs,findAllPostedJobs}