import {PrismaClient} from '@prisma/client'
import {catchDBAsync} from '.././utils/catchAsyn.js'
import { AppError } from '../utils/appError.js';
import { request } from 'express';
const prisma = new PrismaClient();

const createUser = catchDBAsync(async (user)=>{
    const newUsr = await prisma.user.create({
        data : user
    })
    return newUsr;
})

const getUser = catchDBAsync(async (userId)=>{
    const id = userId*1;
    const user = await prisma.user.findUnique({where:{id},include:{qualifications:true}})
    if(!user){
        throw new AppError('User not found with that ID!',404)
    }

    return user;
})

const getUserByEmail = catchDBAsync(async (primaryEmail)=>{

        const user = await prisma.user.findUnique({where:{primaryEmail},include:{qualifications:true}})
        if(!user){
            throw new AppError(`User not found with email: ${primaryEmail}!`,404)
        }
    return user;
})

const userUpdateName = catchDBAsync(async (id,names)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique(id);
        if(!user){
            throw new AppError('User not found with that ID!')
        }
        return prisma.update({
            where: {id},
            data: {
                surname: names.surname,
                firstName: names.firstName,
                lastName: names.lastName,
            }
        })
    })

    return updatedUser;
})

const userUpdateAbout = catchDBAsync (async (updateData)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique({where:{id: updateData.userId}});
        if(!user){
            throw new AppError('User not found with that ID!',404)
        }
        return prisma.users.update({
            where: {id: updateData.userId},
            data: {
                about: updateData.about,
                updatedAt: updateData.updatedAt
            }
        })
    })
    return updatedUser;
})

const userUpdatePhoneNumber = catchDBAsync(async (id,phoneNumber)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique(id);
        if(!user){
            throw new AppError('User not found with that ID!',404)
        }
        return prisma.update({
            where: {id},
            data: {
                phoneNumber,
            }
        })
    })

    return updatedUser;
})

const userUpdatePhoto = catchDBAsync(async (id,photo)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique(id);
        if(!user){
            throw new AppError('User not found with that ID!',404)
        }
        return prisma.update({
            where: {id},
            data: {
                photo,
            }
        })
    })

    return updatedUser;
})

const userAddEmail = catchDBAsync(async (id,email)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique({where:{id}});
        if(!user){
            throw new AppError('User not found with that ID',404)
        }
        user.email.map(el=>{if(!email.includes(el)&&user.primaryEmail!==el){email.push(el)}})

        return prisma.users.update({
            where: {id},
            data: {
              email
            }
        })
    })
    return updatedUser;
})

const removeUserEmail = catchDBAsync( async (id,email)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique({where:{id}});
        if(!user){
            throw new AppError('User not found with that ID',404)
        }
        const updatedEmail = user.email.filter(el=>!email.includes(el))

        return prisma.users.update({
            where: {id},
            data: {
              email: updatedEmail,
            }
        })
    })

    return updatedUser;
})

export {
    createUser,userUpdateName,userUpdateAbout,getUser,getUserByEmail,
    removeUserEmail,userAddEmail,userUpdatePhoneNumber,userUpdatePhoto
}

