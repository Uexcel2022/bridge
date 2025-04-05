import { PrismaClient } from "@prisma/client";
import {timeZone} from '../utils/timeZone.js'
const prisma = new PrismaClient({
    omit: {
        company:{
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

import {catchDBAsync} from '../utils/catchAsyn.js'
import { AppError } from "../utils/appError.js";


export const postJob = catchDBAsync( async(job)=>{
    const newJob = await  prisma.job.create({
        data:{
            title: job.title,
            type: job.type,
            description: job.description,
            location: job.location,
            salary: job.salary,
            createdAt: await timeZone(),
            company: {
                connect: {id: job.companyId},
            }
        },
        include:{
            company: true
        }
    })
    return newJob;
})

export const jobSearch = catchDBAsync(async(queryData)=>{
    const rs = await prisma.job.findMany({
        skip: (queryData.page-1)*queryData.limit|| 0,
        take: queryData.limit || 50,
            where: {
            title:{
                contains: queryData.title,
                mode: 'insensitive', 
            },
            active: true
        },
        orderBy: {createdAt : 'desc'},
        
        include: {company: true},
    })

    if(rs.length === 0){
        throw new AppError('No job not found!',404)
    }
   return rs;
})

export const findPostedJobs = catchDBAsync(async(queryData)=>{
    
    const rs = await prisma.job.findMany({ 
        skip: (queryData.page-1)*queryData.limit|| 0,
        take: queryData.limit || 50,
        where: {
            companyId : queryData.id,
            active : true
        },
        orderBy: {createdAt : 'desc'},
    })

    if(rs.length === 0){
        throw new AppError('No job found!',404)
    }

   return rs;
})


export const findAllPostedJobs = catchDBAsync(async(queryData)=>{
    const rs = await prisma.job.findMany({ 
        skip: (queryData.page-1)*queryData.limit || 0,
        take: queryData.limit || 50,
        where: {active : true},
        orderBy: {createdAt: 'desc'}
    })

    if(rs.length === 0){
        throw new AppError('No job found!',404)
    }
   return rs;
})

export const updateJob = catchDBAsync( async(jobObj)=>{
    const updatedJob = await prisma.$transaction( async (prisma)=>{
        const job = await prisma.job.findUnique({
            where: {
                id: jobObj.id,
                active: true,
                companyId: jobObj.companyId
            }
        });

        if(!job){
            throw new AppError('Job not found!',404)
        }
        return await prisma.job.update({
            where: {id: jobObj.id, companyId: jobObj.companyId, active: true},
            data: {
                ...jobObj.body,
                updatedAt: await timeZone()
            }
        })
    })
    return updatedJob;
});

export const clasedAndOpenJob = catchDBAsync( async(jobObj)=>{
    const updatedJob = await prisma.$transaction( async (prisma)=>{
        const job = await prisma.job.findUnique({
            where: {
                id: jobObj.id,
                companyId: jobObj.companyId
            }
        });

        if(!job){
            throw new AppError('Job not found!')
        }
        return await prisma.job.update({
            where: {id: jobObj.id, companyId: jobObj.companyId},
            data: {
                active: job.active? false : true,
                updatedAt: await timeZone()
            }
        })
    })
    return updatedJob;
})

export const findCloseJobs = catchDBAsync(async(id)=>{
    const rs = await prisma.job.findMany(
        { where: {
            companyId : id,
            active : false
        },orderBy: {createdAt: 'desc'}
    })
    if(rs.length === 0){
        throw new AppError('No job found!',404)
    }
   return rs;
})

export const findJob = catchDBAsync(async(id)=>{
    const rs = await prisma.job.findUnique({ 
        where: {
            id,
            active : true
        }
    })
    if(!rs){
        throw new AppError('Job not found!',404)
    }
   return rs;
})

