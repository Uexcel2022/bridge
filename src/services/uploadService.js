import {PrismaClient} from '@prisma/client'
import {catchDBAsync} from '../utils/catchAsyn.js'
import { AppError } from '../utils/appError.js';
import { timeZone } from '../utils/timeZone.js';

const prisma = new PrismaClient();

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