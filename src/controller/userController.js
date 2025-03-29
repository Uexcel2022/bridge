import { userAddEmail,removeUserEmail,
    userUpdateAbout,userUpdateName} from "../services/userService.js";
import { AppError } from "../utils/appError.js";
import {catchReqResAsync} from '../utils/catchAsyn.js'

export const createUserQualifications = catchReqResAsync(async(req,resp,next)=>{
    req.body.createdAt = new Date(Date.now())
    req.body.userId = user.id
    const newUserQaulf = await createUserQualif(req.body)
    newUserQaulf.user.password=null;
    resp.status(200).json({
        status: 'success',
        data:{
            qaulification: newUserQaulf
        }
    })
})

export const qualificationsUpdate = catchReqResAsync(async(req,resp,next)=>{
    
    req.body.updatedAt = new Date(Date.now())
    req.body.userId = user.id
    req.body.qfId = req.params.id*1
    const updatedUserQualif = await updateQualif(req.body)
    resp.status(200).json({
        status: 'success',
        data:{
            qaulification: updatedUserQualif
        }
    })
})

export const qualificationsDeletion = catchReqResAsync(async(req,resp,next)=>{
    
    await deleteQualif((req.params.id*1))
    resp.status(204).json({
        status: 'success',
        data:{
            qaulification: null,
        }
    })

})



export const addUserEmail = catchReqResAsync(async(req,resp,next)=>{

    const updatedUser = await userAddEmail(req.params.id*1, req.body.email);
    resp.status(200).json({
        status: 'success',
        data:{
            user: updatedUser
        }
    })
    
})

export const userEmailRemoval = catchReqResAsync(async(req,resp,next)=>{
    if(!req.body.email){
        return next(new AppError('Please provide the email to be removed!',404))
    }
    const updatedUser = await removeUserEmail(user.id, req.body.email);
    resp.status(200).json({
        status: 'success',
        data:{
            user: updatedUser
        }
    })
})

export const updateAbout = catchReqResAsync (async(req,resp,next)=>{

    req.body.updatedAt = new Date(Date.now())
    req.body.userId = user.id
    const updatedUser = await userUpdateAbout(req.body)
    resp.status(200).json({
        status: 'success',
        data:{
            user:updatedUser
        }
    })
})


export const nameUpdate = catchReqResAsync( async(req,resp,next)=>{
    const {surname,firstName,lastName} = req.body;
    
    if(!surname||!firstName||!lastName){
        throw new Error("All name fields are reqired!")
    }

    req.body.updatedAt = new Date(Date.now())
    req.body.userId = user.id
    const updatedUser = await userUpdateName(req.body)
    resp.status(200).json({
        status: 'success',
        data:{
            user:updatedUser
        }
    })
})