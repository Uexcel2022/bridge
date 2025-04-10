import {PrismaClient} from '@prisma/client'
import {catchDBAsync} from '../utils/catchAsyn.js'
import { timeZone } from '../utils/timeZone.js'

const prisma = new PrismaClient()

export const signup = catchDBAsync (async(recruiter)=>{

    const newRecruiter= await prisma.recruiter.create({
        data:{
          ...recruiter,
          role: 'recruiter',
          createdAt : await timeZone()
        }
    })
    return newRecruiter;
})

export const getRecruiter= catchDBAsync(async (id)=>{
  const recruiter= await prisma.recruiter.findUnique(
      {where:{id}
  })
  if(!recruiter){
      throw new AppError('Recruiter not found with that ID!',404)
  }
  return recruiter;
})

export const getRecruiterByEmail = catchDBAsync(async (email)=>{

  const recruiter= await prisma.recruiter.findUnique({
    where:{
          email
      }
  })

  if(!recruiter){
      throw new AppError(`Recruiter not found with email: ${email}!`,404)
  }
  return recruiter;
})


export const updateRecruiter= catchDBAsync(async (updateObj)=>{
  const updatedRecruiter= await prisma.$transaction( async (prisma)=>{
      const recruiter= await prisma.recruiter.findUnique({where: {id: updateObj.id}});
      if(!recruiter){
          throw new AppError('Recruiter not found with that ID!',404)
      }
      return await prisma.recruiter.update({
          where: {id: updateObj.id},
          data: {
              name: updateObj.name,
              description: updateObj.description,
              email: updateObj.email,
              phone: updateObj.phone,
              updatedAt: await timeZone()
          }
      })
  })

  return updatedRecruiter;
})


export const updatePhone = catchDBAsync(async (updateObj)=>{
    const updatedrecruiter= await prisma.$transaction( async (prisma)=>{
        const recruiter= await prisma.recruiter.findUnique({where: {id: updateObj.id}});
        if(!recruiter){
            throw new AppError('Recruiter not found with that ID!',404)
        }
        return await prisma.recruiter.update({
            where: {id: updateObj.id},
            data: {
                phone: updateObj.phone,
                updatedAt: await timeZone()
            }
        })
    })
  
    return updatedrecruiter;
  })

  
export const updateEmail = catchDBAsync(async (updateObj)=>{
    const updatedRecruiter= await prisma.$transaction( async (prisma)=>{
        const recruiter= await prisma.recruiter.findUnique({where: {id: updateObj.id}});
        if(!recruiter){
            throw new AppError('Recruiter not found with that ID!',404)
        }
        return await prisma.recruiter.update({
            where: {id: updateObj.id},
            data: {
                email: updateObj.email,
                updatedAt: await timeZone()
            }
        })
    })
  
    return updatedRecruiter;
  })


export const pwdChange = catchDBAsync (async (recruiter)=>{
    const updatedRecruiter= await prisma.$transaction( async (prisma)=>{
        const recruiter= await prisma.recruiter.findUnique({where: {id: recruiter.id}});
        if(!recruiter){
            throw new AppError('Recruiter not found with that ID!',404)
        }
        return await prisma.recruiter.update({
            where: {id: recruiter.id},
            data: {
                password: recruiter.password,
                passwordChangeToken : null,
                passwordChangeTokenExpires: null,
                passwordChangeAt: await timeZone()
            }
        })
    })
    return updatedRecruiter;
})

export const forgetPwd = catchDBAsync( async (id)=>{
    const token = crypto.randomBytes(32).toString('hex');
    const hashToken = crypto.createHash('sha256').update(token).digest('hex')
    const expiresIn = new Date(await timeZone()+10*60*60*1000)
    await prisma.recruiter.update({
        where: {id},
        data:{
            passwordChangeToken : hashToken,
            passwordChangeTokenExpires: expiresIn
        }
    })
    return token;
})


export const getUserByPwdChangeToken = catchDBAsync(async(passwordChangeToken)=>{
    const timestamp = await timeZone();
    const user = await prisma.recruiter.findFirst({
        where : {
            passwordChangeToken, 
            passwordChangeTokenExpires : {gt: timestamp}
        }
    })
    return user;
})


export const deleteRecruiter= catchDBAsync(async (id)=>{
    const recruiter= await prisma.recruiter.findUnique({where: {id}});

    if(!recruiter){
        throw new AppError('Recruiter not found with that ID!',404)
    }
     await prisma.recruiter.delete({where: {id}})
})