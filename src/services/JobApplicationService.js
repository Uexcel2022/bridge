import { PrismaClient } from "@prisma/client";
import {catchDBAsync} from '../utils/catchAsyn.js'
const prisma = new PrismaClient()

const createJobApp = catchDBAsync( async(applicant)=>{
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
            user: true,
            job: true
        }
    })
    return newJobApp;
})



export {createJobApp,}