import {PrismaClient} from '@prisma/client'
import { timeZone } from '../utils/timeZone.js';
const prisma = new PrismaClient();

export const newPost = async (post)=>{
    try{
        const newpst = await prisma.posts.create({
            data : {
                text : post.text,
                createdAt : await timeZone(),
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