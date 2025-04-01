import { PrismaClient } from "@prisma/client";
import {catchDBAsync} from '../utils/catchAsyn.js'
const prisma = new PrismaClient()

export const createJobApp = catchDBAsync( async(applicant)=>{
    const newJobApp = await prisma.applyForJob.create({
        data: {
            name: applicant.name,
            phoneNumber: applicant.phoneNumber,
            cv: applicant.cv,
            createdAt: new Date(Date.now()),
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

export const getJobApplications = catchDBAsync(async(id)=>{

    const rs = await prisma.applyForJob.findMany(
        {where: {
            jobId : id
        }
    })
   return rs;
})

