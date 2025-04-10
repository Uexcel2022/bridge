import {PrismaClient} from '@prisma/client'
import {catchDBAsync} from '../utils/catchAsyn.js'
import { AppError } from '../utils/appError.js';
import { timeZone } from '../utils/timeZone.js';

const prisma = new PrismaClient();

export const recruiterUploadImg = catchDBAsync(async(imgObj) => {
    const image = await prisma.recruiter.update({
        where : {id: imgObj.id},
        data: {
            imageUrl: imgObj.imageUrl,
            publicId: imgObj.publicId,
            updatedAt: await timeZone(),
        },
        
    });
    if (!image) {
        throw new AppError('Unable to save image Url and public ID!', 417);
    }
    return image;
})


export const userUploadImg = catchDBAsync(async(imgObj) => {
    const image = await prisma.user.update({
        where : {id: imgObj.id},
        data: {
            imageUrl: imgObj.imageUrl,
            publicId: imgObj.publicId,
            updatedAt: await timeZone(),
        },
    });
    if (!image) {
        throw new AppError('Unable to save image Url and public ID!', 417);
    }
    return image;
})