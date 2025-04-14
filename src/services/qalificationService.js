import { PrismaClient } from "@prisma/client";
import {catchDBAsync} from '../utils/catchAsyn.js'
import { AppError } from "../utils/appError.js";
import { timeZone } from "../utils/timeZone.js";

const prisma = new PrismaClient({
    omit: {
        qualifications: {
        createdAt: true,
        updatedAt: true,
        },
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

export const createQualification = catchDBAsync (async(userData) =>{
    const newQulif = prisma.$transaction(async (prisma) => {
        const qualif = await getQalif(userData)
        if (qualif) {
                throw new AppError('Qualification already exists!', 409);
            }

        return await prisma.qualifications.create({ 
            data:{
                school: userData.school,
                qualification: userData.qualification,
                createdAt: await timeZone(),
                user:{
                    connect : {id: userData.userId}
                }
            },
            include:{
                user: true
            }
        })
    })
    return newQulif
})

export const updateQualif = catchDBAsync(async (userData)=>{
        const userupdatedQual = await prisma.$transaction(async(prisma)=>{
            const validId = await prisma.qualifications.findUnique({where: {id:userData.qfId}})
            if(!validId){
                throw new AppError('No Qualification found with that ID',404)
            }

            const qualif = await getQalif(userData);
            
            if (qualif) {
                    throw new AppError('Qualification already exists!', 409);
                }
            console.log(userData)
            return await prisma.qualifications.update({
                where: {id: userData.qfId},
                data:{
                    school: userData.school,
                    qualification: userData.qualification,
                    updatedAt: await timeZone(),
                    user:{
                        connect: {id: userData.userId}
                    }
                },
                include :{user: true}
            })
        })
        return userupdatedQual
})

export const deleteQualif = catchDBAsync(async (qalfId)=>{
    await prisma.$transaction(async(prisma)=>{
        const validId = await prisma.qualifications.findUnique({where: {id:qalfId}})
        if(!validId){
            throw new AppError('Record to delete does not exist.',404)
        }
    await prisma.qualifications.delete({where: {id: qalfId}})
    })
})


const getQalif = catchDBAsync(async (userData)=>{
    const qualif = await prisma.qualifications.findFirst({
        where: {
            userId: userData.userId,
            school: userData.school,
            qualification: userData.qualification
        },
    })
   return qualif;
})