import {removeUserEmail,userAddEmail,
    userUpdateAbout,userUpdateName} from "../services/userService.js";
import { AppError } from "../utils/appError.js";
import {catchReqResAsync} from '../utils/catchAsyn.js'



export const addUserEmail = catchReqResAsync(async(req,resp,next)=>{
    if(!req.body.email){
        return next(new AppError('Please provide the email to be added!',404))
    }
    const updateObj = {}
    updateObj.email = req.body.email;
    updateObj.id = req.user.id

    const updatedUser = await userAddEmail(updateObj);
    resp.status(201).json({
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

    const updateObj = {}
    updateObj.email = req.body.email;
    updateObj.id = req.user.id
    
    const updatedUser = await removeUserEmail(updateObj);
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
            user: updatedUser
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