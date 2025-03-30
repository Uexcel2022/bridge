import {PrismaClient} from '@prisma/client'
import {catchDBAsync} from '.././utils/catchAsyn.js'
import { AppError } from '../utils/appError.js';
const prisma = new PrismaClient();

const createUser = catchDBAsync(async (user)=>{
    user.role = 'user'
    const newUsr = await prisma.user.create({
        data : user
    })
    return newUsr;
})

const getUser = catchDBAsync(async (userId)=>{
    const id = userId
    const user = await prisma.user.findUnique(
        {where:{id},
        include:{qualifications:true}
    })
    if(!user){
        throw new AppError('User not found with that ID!',404)
    }
    return user;
})

const getUserByEmail = catchDBAsync(async (primaryEmail)=>{

    const user = await prisma.user.findUnique(
        {where:{
            primaryEmail
        },
        include:{qualifications:true}
    })

    if(!user){
        throw new AppError(`User not found with email: ${primaryEmail}!`,404)
    }
    return user;
})

const userUpdateName = catchDBAsync(async (id,names)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.user.findUnique(id);
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
        return prisma.user.update({
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
        const user = await prisma.user.findUnique(id);
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
        const user = await prisma.user.findUnique(id);
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

const userAddEmail = catchDBAsync( async (updateObj)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const email = updateObj.email;
        const user = await prisma.user.findUnique({where:{id:updateObj.id}});
        if(!user){
            throw new AppError('User not found with that ID',404)
        }
        user.email.map(el=>{if(!email.includes(el) && user.primaryEmail!==el){email.push(el)}})

        return prisma.user.update({
            where: {id: updateObj.id},
            data: {
              email
            }
        })
    })
    return updatedUser;
})

const removeUserEmail = catchDBAsync( async (updateObj)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.user.findUnique({where:{id: updateObj.id}});
        const email = updateObj.email;
        if(!user){
            throw new AppError('User not found with that ID',404)
        }
        const lng = user.email.length
        if(lng < 1){
            throw new AppError('You have no email in your email collections',400); 
        }
        const updatedEmail = user.email.filter(el=>!email.includes(el))

        if(lng === updatedEmail.length){
            throw new AppError('The email does not exist in your email collections',404);
        }
        return prisma.user.update({
            where: {id: updateObj.id},
            data: {
              email: updatedEmail,
            }
        })
    })

    return updatedUser;
})

const pwdChange = catchDBAsync (async (user)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        return prisma.user.update({
            where: {id: user.id},
            data: {
                password: user.password,
                passwordChangeAt: user.passwordChangeAt
            }
        })
    })
    return updatedUser;
})

export {
    createUser,userUpdateName,userUpdateAbout,getUser,getUserByEmail,
    removeUserEmail,userAddEmail,userUpdatePhoneNumber,userUpdatePhoto,
    pwdChange
    
}

