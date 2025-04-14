import {getRecruiter,getRecruiterByEmail,deleteRecruiter,
    updatePhone,updateEmail,
    updateRecruiter} from '../services/recruiterService.js'
import { AppError } from '../utils/appError.js'
import {catchReqResAsync} from '../utils/catchAsyn.js'
import {emailValidation,PhoneValidation,options} from '../validation/userValidation.js'
import {fieldFilter} from '../utils/fieldsFilter.js'


export const getMe = catchReqResAsync(async (req,resp, next)=>{
    if(!req.recruiter.id){
        return next(new AppError('Somwthing went wrong!',500));
     }
    const recruiter = await getRecruiter(req.recruiter.id);
    resp.status(200).json({
        satatus: 'success',
        data: {
            recruiter : await fieldFilter(recruiter)
        }
    })
})

export const fetchRecruiterByEmail = catchReqResAsync(async (req,resp, next)=>{

     if(!req.body.email){
        return next(new AppError('Please provide email address!',400));
     }
    const recruiter = await getRecruiterByEmail(req.body.email);

    if(!recruiter){
        return next(new AppError(`No recruiter found with this email: ${req.body.email}`,404))
    }

    resp.status(200).json({
        satatus: 'success',
        data: {
            recruiter : await fieldFilter(recruiter)
        }
    })
})

export const recruiterUpdate = catchReqResAsync(async(req,resp,next)=>{

    req.body.id = req.recruiter.id;
    const updateRcruiter = await updateRecruiter(req.body)
    resp.status(200).json({
        satatus: 'success',
        data: {
            recruiter : await fieldFilter(updateRcruiter)
        }
    })

})

export const emailUpdate = catchReqResAsync(async(req,resp,next)=>{

    const isValid = {email: req.body.email}

    const valid = emailValidation.validate(isValid, options);

    if(valid.error){
       const err = Object.values(valid.error.details).map(el => `${el.message}`
        .match(/comfirmPassword/) ? el.message.replace(el.message,"Passwords are not the same."):
            el.message.replace('"','').replace('"','')).join(', ')

        return next(new AppError(err ,400))
       }

    req.body.id = req.recruiter.id;
    const updateComp = await updateEmail(req.body)
    resp.status(200).json({
        satatus: 'success',
        data: {
            recruiter : await fieldFilter(updateComp)
        }
    })

})

export const phoneUpdate = catchReqResAsync(async(req,resp,next)=>{

    const isValid = {phoneNumber: req.body.phone}

    const valid = PhoneValidation.validate(isValid, options);

    if(valid.error){
       const err = Object.values(valid.error.details).map(el => `${el.message}`
        .match(/comfirmPassword/) ? el.message.replace(el.message,"Passwords are not the same."):
            el.message.replace('"','').replace('"','')).join(', ')

        return next(new AppError(err ,400))
       }

    req.body.id = req.recruiter.id;
    const updateComp = await updatePhone(req.body)
    resp.status(200).json({
        satatus: 'success',
        data: {
            recruiter : await fieldFilter(updateComp)
        }
    })

})

export const deleRecruiter = catchReqResAsync(async(req,resp,next)=>{
    if(!req.recruiter.id){
        return next(new AppError('Somwthing went wrong!',500));
     }
    await deleteRecruiter(req.recruiter.id)
    resp.status(204).json({
        satatus: 'success',
        data: {
            recruiter : null
        }
    })

})  