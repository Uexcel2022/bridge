import {getRecruiter,getRecruiterByEmail,deleteRecruiter,
    updatePhone,updateEmail} from '../services/recruiterService.js'
import { AppError } from '../utils/appError.js'
import {catchReqResAsync} from '../utils/catchAsyn.js'
import {emailValidation,PhoneValidation,options} from '../validation/userValidation.js'
import {fieldFilter} from '../utils/firldsFilter.js'


export const getMe = catchReqResAsync(async (req,resp, next)=>{
    if(!req.company.id){
        return next(new AppError('Somwthing went wrong!',500));
     }
    const company = await getRecruiter(req.company.id);
    resp.status(200).json({
        satatus: 'success',
        data: {
            company : await fieldFilter(company)
        }
    })
})

export const fetchCompanyByEmail = catchReqResAsync(async (req,resp, next)=>{

     if(!req.body.email){
        return next(new AppError('Please provide email address!',400));
     }
    const company = await getRecruiterByEmail(req.body.email);

    if(!company){
        return next(new AppError(`No company found with this email: ${req.body.email}`,404))
    }

    resp.status(200).json({
        satatus: 'success',
        data: {
            company : await fieldFilter(company)
        }
    })
})

export const compUpdate = catchReqResAsync(async(req,resp,next)=>{

    req.body.id = req.company.id;
    const updateComp = await updateCompany(req.body)
    resp.status(200).json({
        satatus: 'success',
        data: {
            company : await fieldFilter(updateComp)
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

    req.body.id = req.company.id;
    const updateComp = await updateEmail(req.body)
    resp.status(200).json({
        satatus: 'success',
        data: {
            company : await fieldFilter(updateComp)
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

    req.body.id = req.company.id;
    const updateComp = await updatePhone(req.body)
    resp.status(200).json({
        satatus: 'success',
        data: {
            company : await fieldFilter(updateComp)
        }
    })

})

export const deleteComp = catchReqResAsync(async(req,resp,next)=>{
    if(!req.company.id){
        return next(new AppError('Somwthing went wrong!',500));
     }
    await deleteRecruiter(req.company.id)
    resp.status(204).json({
        satatus: 'success',
        data: {
            company : null
        }
    })

})  