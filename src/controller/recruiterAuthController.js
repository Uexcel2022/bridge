import {AppError} from '../utils/appError.js'
import {forgotPwd,getRecruiter,getUserByPwdChangeToken,
    pwdChange,signup,getRecruiterByEmail} from "../services/recruiterService.js";
import {recruiterValidation,options} from '../validation/userValidation.js'
import {catchReqResAsync} from '../utils/catchAsync.js'
import {isStrongPassword} from '../utils/checkPassword.js'
import {promisify} from 'util'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import {sendMail} from '../utils/mail.js'
import {fieldFilter} from '../utils/fieldsFilter.js'

export const recruiterSignup = catchReqResAsync(async(req,resp,next)=>{

    const isValid = {email: req.body.email, phone: req.body.phone,
        password: req.body.password, comfirmPassword: req.body.comfirmPassword}

    const valid = recruiterValidation.validate(isValid, options);

    if(valid.error){
       const a = Object.values(valid.error.details).map(el => `${el.message}`
        .match(/comfirmPassword/) ? el.message.replace(el.message,"Passwords are not the same."):
            el.message.replace('"','').replace('"','')).join(', ')

       return next(new AppError(a ,400))
    }


    if(!isStrongPassword(req.body.password)){           
        return next(new AppError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',400))
    }

    req.body.comfirmPassword = undefined;
    req.body.password = await bcrypt.hash(req.body.password,12);
    const newRec = await signup(req.body);
    
    if(!newRec){
        next(new AppError('Could not register recruiter.',417))
    }

    resp.status(201).json({
        status: 'success',
        data: {
            recruiter: await fieldFilter(newRec)
        }
    })
})

export const recruiterLogin = catchReqResAsync( async(req,resp,next)=>{
    const {email, password} = req.body
    if(!email || !password){
        return next(new AppError('Please provide email and password to login!',400));
    }
    const recruiter =  await getRecruiterByEmail(email) 
    
    if(!recruiter ||!await bcrypt.compare(password,recruiter.password)){
        return next(new AppError('Incorrect email or password!',400));
    }
    
    const token = await promisify(jwt.sign)({id: recruiter.id,role: recruiter.role}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    resp.status(200).json({
        satatus: 'success',
        token,
        data: {
            name: recruiter.name,
            description: recruiter.description
        }
    })
});


export const changePwd = catchReqResAsync(async (req,resp,next)=>{
     
    if(!req.recruiter.id){
        return next(new AppError('Somwthing went wrong!',500));
     }
    
    const {oldPassword,newPassword, comfirmPassword} = req.body
    if(!oldPassword||!newPassword ||!comfirmPassword){
        return next(new AppError(
            'Please provide oldPassword, newPassword and comfirmPassword.',404))
    }

    if(comfirmPassword !== newPassword){
        return next(new AppError('Passwords are not the same.',400))
    }

    if(!isStrongPassword(newPassword)){           
        return next(new AppError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',400))
    }

    let recruiter = await getRecruiter(req.recruiter.id);
     
    if(!await bcrypt.compare(oldPassword,recruiter.password)){
        return  next(new AppError('Invalid password!',400))
    }
    
    recruiter.password  = await bcrypt.hash(newPassword,12)
    
    const updatedRecruiter =  await pwdChange(recruiter)
     console.log(updatedRecruiter)
    resp.status(200).json({
        satatus: 'success',
        data: {
            recruiter : await fieldFilter(updatedRecruiter)
        }
    })
})

export const forgotPassword = catchReqResAsync (async (req,resp,next)=>{
    if(!req.body.email){
        return next(new AppError('Please provide your email.',404))
    }
    const recruiter = await getRecruiterByEmail(req.body.email);

    const pwdChangeToken = await forgotPwd(recruiter.id);

    const url = `${req.protocol}://${req.get('host')}/api/vi/auth/resetPassword/${pwdChangeToken}`
    const message = `Forgot password? Submit a patch request with new password and comfirm password to ${url} \nIgnore if you did not innitiate password reset. Thank you.`
    try{
        await sendMail({
            email: recruiter.email,
            subject: "Reset your password",
            message: message
        })
    }catch(err){
        await pwdChange(recruiter)
        console.log(err)
        throw new AppError("Could not send reset password mail to the recruiter.",417)
    }

    resp.status(200).json({
        status: 'success',
        data:{
            message: 'A password reset mail has been sent to your email.'
        }
    })
})

export const resetPassword = catchReqResAsync(async (req,resp,next)=>{

    if(!req.params.token){
        return next(new AppError('Can not find password change token.',400));
    }
    
    const {newPassword, comfirmPassword} = req.body
    
    if(!comfirmPassword||!newPassword){
        return next(new AppError(
            'Please provide newPassword and comfirmPassword.',404))
    }

    if(comfirmPassword !== newPassword){
        return next(new AppError('Passwords are not the same.',400))
    }

    if(!isStrongPassword(newPassword)){           
        return next(new AppError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',400))
    }
    
    const hashPwdChgToken = crypto.createHash('sha256')
    .update(req.params.token).digest('hex')

    let recruiter = await getUserByPwdChangeToken(hashPwdChgToken);

    if(!recruiter){
        return next(new AppError('Token is invalid or has expired.',400))
    }
    
    recruiter.password  = await bcrypt.hash(newPassword,12)
    await pwdChange(recruiter)

    resp.status(200).json({
        satatus: 'success',
        message: 'Password changed successfully.'
    })
})







