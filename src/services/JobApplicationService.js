import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const jobApp = async (applicant)=>{
   try{
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
   }catch(err){
    console.log(err);
    throw err
   }
}