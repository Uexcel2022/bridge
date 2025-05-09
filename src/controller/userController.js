import {removeUserEmail,userAddEmail,userUpdateAbout,userUpdateName,
    userUpdatePhoneNumber,deleteUser} from "../services/userService.js";
import { AppError } from "../utils/appError.js";
import {catchReqResAsync} from '../utils/catchAsync.js'
import {options,emailValidation,
    userNameValidation,PhoneValidation,} from '../validation/userValidation.js'
import {fieldFilter} from '../utils/fieldsFilter.js'

export const addUserEmail = catchReqResAsync(async(req,resp,next)=>{
    
    const valid = emailValidation.validate(req.body, options);

    if(valid.error){
       const a = Object.values(valid.error.details).map(el => `${el.message}`
        .match(/comfirmPassword/) ? el.message.replace(el.message,"Passwords are not the same."):
            el.message.replace('"','').replace('"','')).join(', ')
       return next(new AppError(a ,400))
    }

    const updateObj = {email: req.body.email, id: req.user.id}
    const updatedUser = await userAddEmail(updateObj);

    resp.status(201).json({
        status: 'success',
        data:{
            user: await fieldFilter(updatedUser)
        }
    })
})

export const userEmailRemoval = catchReqResAsync(async(req,resp,next)=>{
    if(!req.params.index){
        return next(new AppError('Please provide the email to be removed!',404))
    }
    
    const updateObj = {index: req.params.index*1, id: req.user.id};
    const updatedUser = await removeUserEmail(updateObj);
    resp.status(200).json({
        status: 'success',
        data:{
            user: await fieldFilter(updatedUser)
        }
    })
})


export const updateAbout = catchReqResAsync (async(req,resp,next)=>{
    req.body.id = req.user.id
    const updatedUser = await userUpdateAbout(req.body)
    resp.status(200).json({
        status: 'success',
        data:{
            user: await fieldFilter(updatedUser)
        }
    })
})


export const nameUpdate = catchReqResAsync( async(req,resp,next)=>{

    const valid = userNameValidation.validate(req.body, options);

    if(valid.error){
       const a = Object.values(valid.error.details)
       .map(el=>el.message.replace('"','').replace('"','')).join(', ')
       return next(new AppError(a ,400))
    }

    req.body.id = req.user.id
    const updatedUser = await userUpdateName(req.body)
    resp.status(200).json({
        status: 'success',
        data:{
            user: await fieldFilter(updatedUser)
        }
    })
})

export const updatePhoneNumber = catchReqResAsync(async(req,resp,next)=>{
   
   const valid = PhoneValidation.validate(req.body, options);

    if(valid.error){
       const a = Object.values(valid.error.details)
       .map(el=>el.message.replace('"','').replace('"','')).join(', ')
       return next(new AppError(a ,400))
    }
   const updateObj = {id: req.user.id, phoneNumber: req.body.phoneNumber};
   const updatedUser = await userUpdatePhoneNumber(updateObj);
   resp.status(200).json({
    status: 'success',
    data:{
        user: await fieldFilter(updatedUser)
    }})
})



export const deleteOneUser = catchReqResAsync(async (req,resp,next)=>{
    if(!req.user.id){
        return next(new AppError('Somwthing went wrong!',500));
     }
    await deleteUser(req.user.id);
    resp.status(204).json({
        status: 'success',
        data: null
    })
})