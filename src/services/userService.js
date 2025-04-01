import {PrismaClient} from '@prisma/client'
import {catchDBAsync} from '.././utils/catchAsyn.js'
import { AppError } from '../utils/appError.js';
import crypto  from 'crypto'
const prisma = new PrismaClient();

export const createUser = catchDBAsync(async (user)=>{
    user.role = 'user'
    const newUsr = await prisma.user.create({
        data : user
    })
    return newUsr;
})

export const getUser = catchDBAsync(async (userId)=>{
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

export const getUserByEmail = catchDBAsync(async (primaryEmail)=>{

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

export const userUpdateName = catchDBAsync(async (updateObj)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.user.findUnique({where: {id: updateObj.id}});
        if(!user){
            throw new AppError('User not found with that ID!')
        }
        return await prisma.user.update({
            where: {id: updateObj.id},
            data: {
                surname: updateObj.surname,
                firstName: updateObj.firstName,
                lastName: updateObj.lastName,
                gender: updateObj.gender,
                updatedAt: new Date(Date.now())
            }
        })
    })

    return updatedUser;
})

export const userUpdateAbout = catchDBAsync (async (updateData)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique({where:{id: updateData.id}});
        if(!user){
            throw new AppError('User not found with that ID!',404)
        }
        return await prisma.user.update({
            where: {id: updateData.id},
            data: {
                about: updateData.about,
                updatedAt: new Date(Date.now())
            }
        })
    })
    return updatedUser;
})

export const userUpdatePhoneNumber = catchDBAsync(async (updateObj)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.user.findUnique({where: {id: updateObj.id}});
        if(!user){
            throw new AppError('User not found with that ID!',404)
        }
        return await prisma.user.update({
            where: {id: updateObj.id},
            data: {
                phoneNumber: updateObj.phoneNumber,
                updatedAt: new Date(Date.now())
            }
        })
    })

    return updatedUser;
})

export const userUpdatePhoto = catchDBAsync(async (updateObj)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.user.findUnique({where:{id: updateObj.id}});
        if(!user){
            throw new AppError('User not found with that ID!',404)
        }
        return await prisma.user.update({
            where: {id: updateObj.id},
            data: {
                photo: updateObj.photo,
                updatedAt: new Date(Date.now())
            }
        })
    })

    return updatedUser;
})

export const userAddEmail = catchDBAsync( async (updateObj)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        
        const email = [updateObj.email];
        const user = await prisma.user.findUnique({where:{id:updateObj.id}});
        if(!user){
            throw new AppError('User not found with that ID',404)
        }
        user.email.map(el=>{if(!email.includes(el) && user.primaryEmail!==el){email.push(el)}})

        return await prisma.user.update({
            where: {id: updateObj.id},
            data: {
              email,
              updatedAt: new Date(Date.now())
            }
        })
    })
    return updatedUser;
})

export const removeUserEmail = catchDBAsync( async (updateObj)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.user.findUnique({where:{id: updateObj.id}});
        const index = updateObj.index;
        if(!user){
            throw new AppError('User not found with that ID',404)
        }
        const lng = user.email.length
        if(lng < 1){
            throw new AppError('You have no email in your email collections',400); 
        }
        user.email.splice(index,1)

        if(lng === user.email.length){
            throw new AppError('The email does not exist in your email collections',404);
        }

        return await prisma.user.update({
            where: {id: updateObj.id},
            data: {
              email: user.email,
              updatedAt: new Date(Date.now())
            }
        })
    })
    
    return updatedUser;
})

export const pwdChange = catchDBAsync (async (user)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        return await prisma.user.update({
            where: {id: user.id},
            data: {
                password: user.password,
                passwordChangeToken : null,
                passwordChangeTokenExpires: null,
                passwordChangeAt: new Date(Date.now())
            }
        })
    })
    return updatedUser;
})

export const forgetPwd = catchDBAsync( async (id)=>{
    const token = crypto.randomBytes(32).toString('hex');
    const hashToken = crypto.createHash('sha256').update(token).digest('hex')
    const expiresIn = new Date((Date.now()+(10*60*1000)))
    await prisma.user.update({
        where: {id},
        data:{
            passwordChangeToken : hashToken,
            passwordChangeTokenExpires: expiresIn
        }
    })
    return token;
})


export const getUserByPwdChangeToken = catchDBAsync(async(passwordChangeToken)=>{
    const user = await prisma.user.findFirst({
        where : {
            passwordChangeToken, 
            passwordChangeTokenExpires : {gt: new Date(Date.now())}
        }
    })
    return user;
})

export const addCv = catchDBAsync( async (updateObj)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const cv = [updateObj.cv];
        const user = await prisma.user.findUnique({where:{id:updateObj.id}});
        if(!user){
            throw new AppError('User not found with that ID',404)
        }
        user.cv.map(el=>{if(!cv.includes(el)){cv.push(el)}})
        return await prisma.user.update({
            where: {id: updateObj.id},
            data: {
              cv,
              updatedAt: new Date(Date.now())
            }
        })
    })
    return updatedUser;
})

export const deleteCv = catchDBAsync( async (updateObj)=>{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.user.findUnique({where:{id: updateObj.id}});
        if(!user){
            throw new AppError('User not found with that ID',404)
        }
        const lng = user.cv.length
        if(lng < 1){
            throw new AppError('You have no cv in your cv collections',400); 
        }
           user.cv.splice(updateObj.index,1)

        if(lng === user.cv.length){
            throw new AppError('The cv does not exist in your cv collections',404);
        }
        return await prisma.user.update({
            where: {id: updateObj.id},
            data: {
              cv: user.cv,
              updatedAt: new Date(Date.now())
            }
        })
    })

    return updatedUser;
})

