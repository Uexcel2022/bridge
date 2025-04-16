import {PrismaClient} from '@prisma/client'
import {catchDBAsync} from '../utils/catchAsync.js'
import { AppError } from '../utils/appError.js';
import { timeZone } from '../utils/timeZone.js';
import {cloudinary} from '../utils/cloudinayConfig.js'
const prisma = new PrismaClient({
    omit: {
        recruiter: {
            createdAt: true,
            updatedAt: true,
            password: true,
            passwordChangeAt: true,
            passwordChangeToken: true,
            passwordChangeTokenExpires: true,
            
        },
        user: {
           createdAt: true,
           updatedAt: true,
           password: true,
           passwordChangeAt: true,
           passwordChangeToken: true,
           passwordChangeTokenExpires: true,
    
        },
        resume: {
            createdAt: true,
            updatedAt: true,
        },
        qualifications: {
            createdAt: true,
            updatedAt: true,
        }


    }
});

export const recruiterUploadImg = catchDBAsync(async(pfdFileData) => {
    const image = await prisma.recruiter.update({
        where : {id: pfdFileData.id},
        data: {
            imageUrl: pfdFileData.imageUrl,
            publicId: pfdFileData.publicId,
            updatedAt: await timeZone(),
        },
        
    });
    if (!image) {
        throw new AppError('Unable to save file Url and public ID!', 417);
    }
    return image;
})


export const userUploadImg = catchDBAsync(async(pfdFileData) => {
    const image = await prisma.user.update({
        where : {id: pfdFileData.id},
        data: {
            imageUrl: pfdFileData.imageUrl,
            publicId: pfdFileData.publicId,
            updatedAt: await timeZone(),
        },
    });
    if (!image) {
        throw new AppError('Unable to save file Url and public ID!', 417);
    }
    return image;
})

export const uploadResume = catchDBAsync(async(pfdFileData) => {
    const file = await prisma.resume.create({
        data: {
            imageUrl: pfdFileData.imageUrl,
            publicId: pfdFileData.publicId,
            user: { 
                connect: {id: pfdFileData.id}
            },
            createdAt: await timeZone(),
        },
    });
    if (!file) {
        throw new AppError('Unable to save file Url and public ID!', 417);
    }
    return file;
})


export const deleteImageUser = catchDBAsync(async(id)=>{

    const res = await prisma.$transaction(async(prisma)=>{
    
        const user = await prisma.user.findUnique({where:{id}})
        
        if(!user){
            throw new AppError('User does not found',404)
        }

        if(!user.publicId){
            throw new AppError('File does not exist',404)
        }
        const rs = await cloudinary.uploader.destroy(user.publicId);
        
        if(rs.result !== 'ok'){
            throw new AppError(`Fail because file ${rs.result}`,417)
        }
    
        return await prisma.user.update({
            where: {id: user.id},
            data:{
               ...user,
               imageUrl: null,
               publicId: null,
               updatedAt: await timeZone()
            },
            include: {qualifications: true,resume:true}
        })
    })

    return res
})

export const deleteImageRecruiter = catchDBAsync(async(id)=>{

    const res = await prisma.$transaction(async(prisma)=>{
    
        const recruiter = await prisma.recruiter.findUnique({where:{id}})
        
        if(!recruiter){
            throw new AppError('User does not found',404)
        }

        if(!recruiter.publicId){
            throw new AppError('File does not exist',404)
        }
        const rs = await cloudinary.uploader.destroy(recruiter.publicId);
        
        if(rs.result !== 'ok'){
            throw new AppError(`Fail because file ${rs.result}`,417)
        }
    
        return await prisma.recruiter.update({
            where: {id: recruiter.id},
            data:{
               ...recruiter,
               imageUrl: null,
               publicId: null,
               updatedAt: await timeZone()
            },
        })
    })

    return res
})