import {AppError} from '../utils/appError.js'
import { createUser,getUser, getUserByEmail,pwdChange,forgetPwd,
    getUserByPwdChangeToken} from "../services/userService.js";
import {userValidation,options} from '../validation/userValidation.js'
import {catchReqResAsync} from '../utils/catchAsync.js'
import {promisify} from 'util'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import {sendMail} from '../utils/mail.js'
import {fieldFilter} from '../utils/fieldsFilter.js'
import { isStrongPassword } from '../utils/checkPassword.js';

export const signupUser = catchReqResAsync(async (req,resp, next)=>{

    const valid = userValidation.validate(req.body, options);

    if(valid.error){
       const a = Object.values(valid.error.details)
       .map(el => `${el.message}`
        .match(/comfirmPassword/) ? el.message.replace(el.message,"Passwords are not the same."):
            el.message.replace('"','').replace('"','')).join(', ')

       return next(new AppError(a ,400))
    }

    if(!isStrongPassword(req.body.password)){           
            return next(new AppError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',400))
        }

    req.body.password = await bcrypt.hash(req.body.password,12);

    const newUser = await createUser(req.body);
    resp.status(201).json({
        satatus: 'success',
        data: {
            user : await fieldFilter(newUser)
        }
    })
})

export const loginUser = catchReqResAsync( async(req,resp,next)=>{
    const {primaryEmail, password} = req.body
    if(!primaryEmail || !password){
        return next(new AppError('Please provide email and password to login!',400));
    }
    const user =  await getUserByEmail(primaryEmail) 
    
    if(!user||!await bcrypt.compare(password,user.password)){
        return next(new AppError('Incorrect email or password!',400));
    }

    const token = await promisify(jwt.sign)({id: user.id,role: user.role}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN

    })

    const cookieOptions = {
        expires: new Date(Date.now()+process.env.COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly: true,
        sameSite: 'None',
        partitioned: true,
        path: '/'
    }
  
    if(process.env.NODE_ENV.match(/^production$/)){
       cookieOptions.secure = true;
    }

    resp.cookie('token',token,cookieOptions)

    resp.status(200).json({
        satatus: 'success',
        token,
        data: {
            name: `${user.firstName} ${user.middleName}`
        }
    })
});

export const getMe = catchReqResAsync(async (req,resp, next)=>{
    if(!req.user.id){
        return next(new AppError('Somwthing went wrong!',500));
     }
    const user = await getUser(req.user.id);
    resp.status(200).json({
        satatus: 'success',
        data: {
            user : await fieldFilter(user)
        }
    })
})

export const fetchUserByEmail = catchReqResAsync(async (req,resp, next)=>{

    const primaryEmail =  req.body.primaryEmail;

     if(!primaryEmail){
        return next(new AppError('Please provide email address!',400));
     }
    const user = await getUserByEmail(primaryEmail);

    if(!user){
        return next(new AppError(`No user found with this email: ${primaryEmail}`,404))
    }

    resp.status(200).json({
        satatus: 'success',
        data: {
            user : await fieldFilter(user)
        }
    })
})

export const changePwd = catchReqResAsync(async (req,resp,next)=>{
     
    if(!req.user.id){
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

    let user = await getUser(req.user.id);

    if(!await bcrypt.compare(oldPassword,user.password)){
        return next(new AppError('Invalid password!',400))
    }
    
    user.password = await bcrypt.hash(newPassword,12)

    user =  await pwdChange(user)

    resp.status(200).json({
        satatus: 'success',
        data: {
            user : await fieldFilter(user)
        }
    })
})

export const forgetPassword = catchReqResAsync (async (req,resp,next)=>{
    if(!req.body.primaryEmail){
        return next(new AppError('Please provide your default email.'))
    }
    const user = await getUserByEmail(req.body.primaryEmail);
    const pwdChangeToken = await forgetPwd(user.id);

    const url = `${req.protocol}://${req.get('host')}/api/vi/auth/resetPassword/${pwdChangeToken}`
    const message = `Forgot password? Submit a patch request with new password and comfirm password to ${url} \nIgnore if you did not innitiate password reset. Thank you.`
    try{
        await sendMail({
            email: user.primaryEmail,
            subject: "Reset your password",
            message: message
        })
    }catch(err){
        await pwdChange(user)
        console.log(err)
        throw new AppError("Could not send reset password mail to the user.",417)
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

    let user = await getUserByPwdChangeToken(hashPwdChgToken);

    if(!user){
        return next(new AppError('Token is invalid or has expired.',400))
    }
    
    user.password = await bcrypt.hash(newPassword,12)

    await pwdChange(user)

    resp.status(200).json({
        satatus: 'success',
        message: 'Password changed successfully.'
    })
})







