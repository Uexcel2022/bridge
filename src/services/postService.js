import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();

export const newPost = async (post)=>{
    try{
        const newpst = await prisma.posts.create({
            data : {
                text : post.text,
                createdAt : new Date(Date.now()),
                user : {
                    connect : {
                        id : post.userId
                    }
                }
            },

            include : {
                user : true
            }
        })
        return newpst;

    }catch(err){
        console.error(err)
        throw err
    }
}