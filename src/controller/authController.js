import {AppError} from '../utils/appError.js'
import { createUser,getUser, getUserByEmail, } from "../services/userService.js";
import {userValidation,options} from '../validation/userValidation.js'
import {catchReqResAsync} from '.././utils/catchAsyn.js'
import {promisify} from 'util'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const signup = catchReqResAsync(async (req,resp, next)=>{

    const valid = userValidation.validate(req.body, options);

    if(valid.error){
       const a = Object.values(valid.error.details)
       .map(el=>el.message.replace('"','').replace('"','')).join(', ')
       return next(new AppError(a ,400))
    }

    const hashedPwd = await bcrypt.hash(req.body.password,12);
    req.body.password = hashedPwd;
    req.body.createdAt = new Date(Date.now())
    const newUser = await createUser(req.body);
    resp.status(201).json({
        satatus: 'success',
        data: {
            user : newUser
        }
    })
})

const login = catchReqResAsync( async(req,resp,next)=>{
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

const protect = catchReqResAsync(async(req,resp,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1]
    }
    
    if(!token){
        return new AppError('You are not logged in. Please login to continue!',401)
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

    req.user = user
    next()
})












const getMe = catchReqResAsync(async (req,resp, next)=>{
    if(!req.params.id){
        return next(new AppError('Somwthing went wrong!',500));
     }
    const newUser = await getUser(req.params.id);
    resp.status(200).json({
        satatus: 'success',
        data: {
            user : newUser
        }
    })
})

const fetchUserByEmail = catchReqResAsync(async (req,resp, next)=>{
     if(!req.body.primaryEmail){
        return next(new AppError('Please provide email address!',400));
     }
    const user = await getUserByEmail(req.body.primaryEmail);

    if(!user){
        return next(new AppError(`No user found with is email: ${req.body.primaryEmail}`,404))
    }
    resp.status(200).json({
        satatus: 'success',
        data: {
            user
        }
    })
})

export {getMe,signup,fetchUserByEmail,login,protect}