import { PrismaClient } from "@prisma/client";
import {catchDBAsync} from '../utils/catchAsyn.js'
import { timeZone } from "../utils/timeZone.js";
import { AppError } from "../utils/appError.js";
const prisma = new PrismaClient({
    omit: {
        user:{
           password: true,
           passwordChangeAt: true,
           createdAt: true,
           updatedAt: true,
           passwordChangeToken: true,
           passwordChangeTokenExpires: true,
           role: true
        }
    }
});

export const createJobApp = catchDBAsync( async(applicant)=>{
    const newJobApp = await prisma.applyForJob.create({
        data: {
            name: applicant.name,
            phoneNumber: applicant.phoneNumber,
            cv: applicant.cv,
            createdAt: await timeZone(),
            user: {
               connect: {id: applicant.userId}
            },

            job: {
                connect: {id: applicant.jobId}
             }
        },
        include:{
            job: true
        }
    })
    return newJobApp;
})

export const getJobApplications = catchDBAsync(async(queryData)=>{
    const rs = await prisma.applyForJob.findMany({
        skip: (queryData.page-1)*queryData.limit|| 0,
        take: queryData.limit || 50,
        where: {
            jobId : queryData.id
        },
        orderBy: {createdAt : 'desc'}
    })
    if(app.length===0){
        throw new AppError('There is no application for this job!',404);
    }
   return rs;
})

export const deleteJobApplications = catchDBAsync(async(jobId)=>{
         await prisma.$transaction(async(prisma)=>{
            const app = await prisma.applyForJob.findMany({
                where:{id: jobId}
            });

            if(app.length===0){
                throw new AppError('No application for this job!',404);
            }
            await prisma.applyForJob.deleteMany({
                where: {id: jobId}
            })
         })
        
    })

