import {PrismaClient} from '@prisma/client'
import {catchDBAsync} from '../utils/catchAsyn.js'
import { timeZone } from '../utils/timeZone.js'

const prisma = new PrismaClient()

export const signup = catchDBAsync (async(company)=>{

    const newCompany = await prisma.company.create({
        data:{
          ...company,
          role: 'company',
          createdAt : await timeZone()
        }
    })
    return newCompany;
})

export const getCompany = catchDBAsync(async (id)=>{
  const company = await prisma.company.findUnique(
      {where:{id}
  })
  if(!company){
      throw new AppError('User not found with that ID!',404)
  }
  return company;
})

export const getCompanyByEmail = catchDBAsync(async (email)=>{

  const company = await prisma.company.findUnique({
    where:{
          email
      }
  })

  if(!company){
      throw new AppError(`User not found with email: ${email}!`,404)
  }
  return company;
})


export const updateCompany = catchDBAsync(async (updateObj)=>{
  const updatedCompany = await prisma.$transaction( async (prisma)=>{
      const company = await prisma.company.findUnique({where: {id: updateObj.id}});
      if(!company){
          throw new AppError('Company not found with that ID!',404)
      }
      return await prisma.company.update({
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

  return updatedCompany;
})


export const updatePhone = catchDBAsync(async (updateObj)=>{
    const updatedCompany = await prisma.$transaction( async (prisma)=>{
        const company = await prisma.company.findUnique({where: {id: updateObj.id}});
        if(!company){
            throw new AppError('Company not found with that ID!',404)
        }
        return await prisma.company.update({
            where: {id: updateObj.id},
            data: {
                phone: updateObj.phone,
                updatedAt: await timeZone()
            }
        })
    })
  
    return updatedCompany;
  })

  
export const updateEmail = catchDBAsync(async (updateObj)=>{
    const updatedCompany = await prisma.$transaction( async (prisma)=>{
        const company = await prisma.company.findUnique({where: {id: updateObj.id}});
        if(!company){
            throw new AppError('Company not found with that ID!',404)
        }
        return await prisma.company.update({
            where: {id: updateObj.id},
            data: {
                email: updateObj.email,
                updatedAt: await timeZone()
            }
        })
    })
  
    return updatedCompany;
  })


export const pwdChange = catchDBAsync (async (company)=>{
    const updatedCompany = await prisma.$transaction( async (prisma)=>{
        const company = await prisma.company.findUnique({where: {id: company.id}});
        if(!company){
            throw new AppError('Company not found with that ID!',404)
        }
        return await prisma.company.update({
            where: {id: company.id},
            data: {
                password: company.password,
                passwordChangeToken : null,
                passwordChangeTokenExpires: null,
                passwordChangeAt: await timeZone()
            }
        })
    })
    return updatedCompany;
})

export const forgetPwd = catchDBAsync( async (id)=>{
    const token = crypto.randomBytes(32).toString('hex');
    const hashToken = crypto.createHash('sha256').update(token).digest('hex')
    const expiresIn = new Date(await timeZone()+10*60*60*1000)
    await prisma.company.update({
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
    const user = await prisma.company.findFirst({
        where : {
            passwordChangeToken, 
            passwordChangeTokenExpires : {gt: timestamp}
        }
    })
    return user;
})


export const deleteCompany = catchDBAsync(async (id)=>{
    const company = await prisma.company.findUnique({where: {id}});

    if(!company){
        throw new AppError('Company not found with that ID!',404)
    }
     await prisma.company.delete({where: {id}})
})