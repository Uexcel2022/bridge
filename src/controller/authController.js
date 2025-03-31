import {AppError} from '../utils/appError.js'
import { createUser,getUser, getUserByEmail,pwdChange,forgetPwd,getUserByPwdChangeToken} from "../services/userService.js";
import {userValidation,options} from '../validation/userValidation.js'
import {catchReqResAsync} from '.././utils/catchAsyn.js'
import {promisify} from 'util'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import {sendMail} from '../utils/mail.js'

export const signup = catchReqResAsync(async (req,resp, next)=>{

    const valid = userValidation.validate(req.body, options);

    if(valid.error){
       const a = Object.values(valid.error.details)
       .map(el=>el.message.replace('"','').replace('"','')).join(', ')
       return next(new AppError(a ,400))
    }

    const hashedPwd = await bcrypt.hash(req.body.password,12);
    req.body.password = hashedPwd;
    req.body.createdAt = new Date(Date.now())
    req.body.confirmPassword = undefined;
    const newUser = await createUser(req.body);
    resp.status(201).json({
        satatus: 'success',
        data: {
            user : newUser
        }
    })
})

export const login = catchReqResAsync( async(req,resp,next)=>{
    const {primaryEmail, password} = req.body
    if(!primaryEmail || !password){
        return next(new AppError('Please provide email and password to login!',400));
    }
    const user =  await getUserByEmail(primaryEmail) 
    
    if(!await bcrypt.compare(password,user.password)){
        return next(new AppError('Incorrect email or password!',400));
    }
    
    const token = await promisify(jwt.sign)({id: user.id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    resp.status(200).json({
        satatus: 'success',
        token,
        data: {
            name: `${user.firstName} ${user.middleName}`
        }
    })
});

export const protect = catchReqResAsync(async(req,resp,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1]
    }
    
    if(!token){
        return next(
            new AppError('You are not logged in. Please login to continue!',401))
    }

    const docodedToken = await promisify(jwt.verify)(token,process.env.JWT_SECRET)

    const user=  await getUser(docodedToken.id);

    if(!user){
        return new AppError('The user associated with the token does not exist', 401)
    }

    if(user.passwordChangeAt !== null){
        const pwdChgTime = parseInt(user.passwordChangeAt.getTime()/1000,10)
      if(docodedToken.iat < pwdChgTime){
        return next(new AppError('You changed password recently. Please login again.', 401))
      }
    }

    user.password = null;
    req.user = user
    next()
})

export const restrictTo = (...roles)=>{
    return(req,resp,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError(
                'You do not have permission to perform this action',403)
            )
        }
        next();
    }
}


export const getMe = catchReqResAsync(async (req,resp, next)=>{
    if(!req.user.id){
        return next(new AppError('Somwthing went wrong!',500));
     }
    const user = await getUser(req.user.id);
    user.password = null
    resp.status(200).json({
        satatus: 'success',
        data: {
            user
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
    user.password = null

    resp.status(200).json({
        satatus: 'success',
        data: {
            user
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
    let user = await getUser(req.user.id);

    if(!await bcrypt.compare(oldPassword,user.password)){
        return next('Invalid password!',400)
    }
    
    const hashedPwd  = await bcrypt.hash(newPassword,12)

    user.password = hashedPwd
    user.passwordChangeAt = new Date(Date.now())

    user =  await pwdChange(user)

    user.password = null

    resp.status(200).json({
        satatus: 'success',
        data: {
            user
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
    
    const hashPwdChgToken = crypto.createHash('sha256')
    .update(req.params.token).digest('hex')

    let user = await getUserByPwdChangeToken(hashPwdChgToken);

    if(!user){
        return next(new AppError('Token is invalid or has expired.',400))
    }
    
    const hashedPwd  = await bcrypt.hash(newPassword,12)

    user.password = hashedPwd
    user.passwordChangeAt = new Date(Date.now())

    await pwdChange(user)

    resp.status(200).json({
        satatus: 'success',
        message: 'Password changed successfully.'
    })
})

// $2b$12$xYBQ36TgjR98Gf/.auQdGOJS/KLZrIg/G/uhgqQdp6uFG5UFFUMrK






