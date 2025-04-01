import { PrismaClient } from "@prisma/client";
import {catchDBAsync} from '../utils/catchAsyn.js'
import { AppError } from "../utils/appError.js";

const prisma = new PrismaClient();

export const createQualification = catchDBAsync (async(qualifs) =>{
    const newQual = await prisma.qualifications.create({ 
        data:{
            school: qualifs.school,
            qualification: qualifs.qualification,
            createdAt: new Date(Date.now()),
            user:{
                connect : {id: qualifs.userId}
            }
        },
        include:{
            user: true
        }
    })
    return newQual;
})

export const updateQualif = catchDBAsync(async (userQualf)=>{
        const userupdatedQual = await prisma.$transaction(async(prisma)=>{
            const qualif = await prisma.qualifications.findUnique({where: {id:userQualf.qfId}})
            if(!qualif){
                throw new AppError('No Qualification found with that ID',404)
            }
            return prisma.qualifications.update({
                where: {id:userQualf.qfId},
                data:{
                    school: userQualf.school,
                    qualification: userQualf.qualification,
                    updatedAt: new Date(Date.now()),
                    user:{
                        connect: {id: userQualf.userId}
                    }
                },
                include :{user: userQualf.userId}
            })
        })
        return userupdatedQual
})

export const deleteQualif = catchDBAsync(async (qalfId)=>{
    await prisma.qualifications.delete({where: {id: qalfId}})
})

