import {addCv, deleteCv, removeUserEmail,userAddEmail,
    userUpdateAbout,userUpdateName,userUpdatePhoneNumber,userUpdatePhoto} from "../services/userService.js";
import { AppError } from "../utils/appError.js";
import {catchReqResAsync} from '../utils/catchAsyn.js'
import {options,userEmailValidation,
    userNameValidation,userPhoneNumberValidation,} from '../validation/userValidation.js'



export const addUserEmail = catchReqResAsync(async(req,resp,next)=>{
    const valid = userEmailValidation.validate(req.body, options);

    if(valid.error){
       const a = Object.values(valid.error.details)
       .map(el=>el.message.replace('"','').replace('"','')).join(', ')
       return next(new AppError(a ,400))
    }
    const updateObj = {email: req.body.email, id: req.user.id}
    const updatedUser = await userAddEmail(updateObj);
    resp.status(201).json({
        status: 'success',
        data:{
            user: updatedUser
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
            user: updatedUser
        }
    })
})

export const updateAbout = catchReqResAsync (async(req,resp,next)=>{
    req.body.id = req.user.id
    const updatedUser = await userUpdateAbout(req.body)
    resp.status(200).json({
        status: 'success',
        data:{
            user: updatedUser
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
            user: updatedUser
        }
    })
})

export const updatePhoneNumber = catchReqResAsync(async(req,resp,next)=>{
   
   const valid = userPhoneNumberValidation.validate(req.body, options);

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
        user: updatedUser
    }})
})

export const updatePhoto = catchReqResAsync (async(req,resp,next)=>{
    if(!req.body.photo){
        return next(new AppError('Please provide photo name.',400));
    }
    req.body.id = req.user.id
    const updatedUser = await userUpdatePhoto(req.body)
    resp.status(200).json({
        status: 'success',
        data:{
            user: updatedUser
        }
    })
})


export const uploadCv = catchReqResAsync(async(req,resp,next)=>{
    if(!req.body.cv){
        return next(new AppError('Please provide cv.',400))
    }
    
    if(req.body.cv.split('.')[1]!=="pdf"){
        return next(new AppError('Please provide pdf document',400))
    }

    req.body.id =req.user.id;
    const updatedUser = await addCv(req.body);
    resp.status(200).json({
        status: 'success',
        data:{
            user: updatedUser
        }
    })

})


export const removeCv = catchReqResAsync(async(req,resp,next)=>{
    if(!req.params.index){
        return next(new AppError('Please provide cv.',400))
    }
    const updateObj = {id: req.user.id, index: req.params.index*1}
    const updatedUser = await deleteCv(updateObj);
    resp.status(200).json({
        status: 'success',
        data:{
            user: updatedUser
        }
    })

})
