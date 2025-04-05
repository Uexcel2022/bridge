import {AppError} from '../utils/appError.js'
import {signup,getCompany,getCompanyByEmail,forgetPwd,
    getUserByPwdChangeToken,pwdChange} from "../services/companyService.js";
import {companyValidation,options} from '../validation/userValidation.js'
import {catchReqResAsync} from '../utils/catchAsyn.js'
import {isStrongPassword} from '../utils/checkPassword.js'
import {promisify} from 'util'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import {sendMail} from '../utils/mail.js'
import {fieldFilter,authFieldFilter} from '../utils/firldsFilter.js'

export const companySignup = catchReqResAsync(async(req,resp,next)=>{

    const isValid = {email: req.body.email, phone: req.body.phone,
        password: req.body.password, comfirmPassword: req.body.comfirmPassword}

    const valid = companyValidation.validate(isValid, options);

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
    const newComp = await signup(req.body);
    resp.status(201).json({
        status: 'success',
        data: {
            company: await fieldFilter(newComp)
        }
    })
})

export const companyLogin = catchReqResAsync( async(req,resp,next)=>{
    const {email, password} = req.body
    if(!email || !password){
        return next(new AppError('Please provide email and password to login!',400));
    }
    const company =  await getCompanyByEmail(email) 
    
    if(!company ||!await bcrypt.compare(password,company.password)){
        return next(new AppError('Incorrect email or password!',400));
    }
    
    const token = await promisify(jwt.sign)({id: company.id,role: company.role}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    resp.status(200).json({
        satatus: 'success',
        token,
        data: {
            name: company.name,
            description: company.description
        }
    })
});

export const protectCompany = catchReqResAsync(async(req,resp,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1]
    }
    
    if(!token){
        return next(
            new AppError('You are not logged in. Please login to continue!',401))
    }
    
    const docodedToken = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    
    if(docodedToken.role !== 'company'){
        console.log(`companyProtect: You do not have permission to perform this operation. ID: ${docodedToken.id}`)
        return next(new AppError('You do not have permission to perform this operation.',403))    
    }             
    
    const company = await getCompany(docodedToken.id);

    if(!company){
        return next(new AppError('The company associated with the token does not exist', 401))
    }
    
    const jwtIssuedTime = docodedToken.iat + new Date().getTimezoneOffset()*-1*60;
     
    if(company.passwordChangeAt !== null){
        const pwdChgTime = parseInt(company.passwordChangeAt.getTime()/1000,10)
      if(jwtIssuedTime < pwdChgTime){
        return next(new AppError('You changed password recently. Please login again.', 401))
      }
    }
    req.company = await authFieldFilter(company)
    next()
})


export const restrictCompanyTo = (...roles)=>{
    return(req,resp,next)=>{
        if(!roles.includes(req.company.role)){
            return next(new AppError(
                'You do not have permission to perform this action',403)
            )
        }
        next();
    }
}

export const changePwd = catchReqResAsync(async (req,resp,next)=>{
     
    if(!req.company.id){
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

    let company = await getCompany(req.company.id);

    if(!await bcrypt.compare(oldPassword,company.password)){
        return  next(new AppError('Invalid password!',400))
    }
    
    company.password  = await bcrypt.hash(newPassword,12)

    company =  await pwdChange(company)

    resp.status(200).json({
        satatus: 'success',
        data: {
            company : await fieldFilter(company)
        }
    })
})

export const forgetPassword = catchReqResAsync (async (req,resp,next)=>{
    if(!req.body.email){
        return next(new AppError('Please provide your email.',404))
    }
    const company = await getCompanyByEmail(req.body.email);
    const pwdChangeToken = await forgetPwd(company.id);

    const url = `${req.protocol}://${req.get('host')}/api/vi/auth/resetPassword/${pwdChangeToken}`
    const message = `Forgot password? Submit a patch request with new password and comfirm password to ${url} \nIgnore if you did not innitiate password reset. Thank you.`
    try{
        await sendMail({
            email: company.email,
            subject: "Reset your password",
            message: message
        })
    }catch(err){
        await pwdChange(company)
        console.log(err)
        throw new AppError("Could not send reset password mail to the company.",417)
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

    let company = await getUserByPwdChangeToken(hashPwdChgToken);

    if(!company){
        return next(new AppError('Token is invalid or has expired.',400))
    }
    
    company.password  = await bcrypt.hash(newPassword,12)
    await pwdChange(company)

    resp.status(200).json({
        satatus: 'success',
        message: 'Password changed successfully.'
    })
})







