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