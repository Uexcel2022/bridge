import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();

export const createUser = async (user)=>{
    try{
    const newUsr = await prisma.users.create({
        data : user
    })

    return newUsr;

    }catch(err){
        console.log(err)
        throw err;
    }
}

export const userUpdateName = async (id,names)=>{
    try{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        
        const user = await prisma.users.findUnique(id);
        if(!user){
            throw new Error('User not found that ID!')
        }
        return prisma.update({
            where: {id},
            data: {
                surname: names.surname,
                firstName: names.firstName,
                lastName: names.lastName
            }
        })
    })

    return updatedUser;
    }catch(err){
        console.log(err)
        throw err;
    }
}

export const userUpdateAbout = async (updateData)=>{
    try{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique({where:{id: updateData.userId}});
        if(!user){
            throw new Error('User not found that ID!')
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
    }catch(err){
        console.log(err)
        throw err;
    }
}

export const userUpdatePhoneNumber = async (id,phoneNumber)=>{
    try{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique(id);
        if(!user){
            throw new Error('User not found that ID!')
        }
        return prisma.update({
            where: {id},
            data: {
                phoneNumber,
            }
        })
    })

    return updatedUser;
    }catch(err){
        console.log(err)
        throw err;
    }
}

export const userUpdatePhoto = async (id,photo)=>{
    try{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique(id);
        if(!user){
            throw new Error('User not found that ID!')
        }
        return prisma.update({
            where: {id},
            data: {
                photo,
            }
        })
    })

    return updatedUser;
    }catch(err){
        console.log(err)
        throw err;
    }
}

export const createUserQualif = async (userQualf)=>{
    try{
        const userNewQul = await prisma.qualifications.create({
            data:{
                school: userQualf.school,
                qualification: userQualf.qualification,
                createdAt: userQualf.createdAt,
                user:{
                    connect: {id: userQualf.userId}
                }
            },
            include :{user: userQualf.userId}
        })
        return userNewQul
    }catch(err){
        console.log(err)
        throw err;
    }
}

export const updateQualif = async (userQualf)=>{
    try{
        const userupdatedQual = await prisma.$transaction(async(prisma)=>{
            const qualif = await prisma.qualifications.findUnique({where: {id:userQualf.qfId}})
            if(!qualif){
                throw new Error('No Qualification found with that ID')
            }
             
            return prisma.qualifications.update({
                where: {id:userQualf.qfId},
                data:{
                    school: userQualf.school,
                    qualification: userQualf.qualification,
                    updatedAt: userQualf.updatedAt,
                    user:{
                        connect: {id: userQualf.userId}
                    }
                },
                include :{user: userQualf.userId}
            })
        })
        return userupdatedQual
    }catch(err){
        console.log(err)
        throw err;
    }
}

export const deleteQualif = async (qalfId)=>{
    try{
        await prisma.qualifications.delete({where: {id: qalfId}})
    }catch(err){
        console.log(err)
        throw err;
    }
}

export const userAddEmail = async (id,email)=>{
    try{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique({where:{id}});
        if(!user){
            throw new Error('User not found that ID')
        }
        user.email.map(el=>email.push(el))

        return prisma.users.update({
            where: {id},
            data: {
              email
            }
        })
    })
    return updatedUser;
    }catch(err){
        console.log(err)
        throw err;
    }
}

export const removeUserEmail = async (id,email)=>{
    try{
    const updatedUser = await prisma.$transaction( async (prisma)=>{
        const user = await prisma.users.findUnique({where:{id}});
        if(!user){
            throw new Error('User not found that ID')
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
    }catch(err){
        console.log(err)
        throw err;
    }


}


