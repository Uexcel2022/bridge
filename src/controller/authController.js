import {AppError} from '../utils/appError.js'
import { createUser,getUser, getUserByEmail, } from "../services/userService.js";
import {userValidation,options} from '../validation/userValidation.js'
import {catchReqResAsync} from '.././utils/catchAsyn.js'

const signup = catchReqResAsync(async (req,resp, next)=>{

    const valid = userValidation.validate(req.body, options);

    if(valid.error){
       const a = Object.values(valid.error.details)
       .map(el=>el.message.replace('"','').replace('"','')).join(', ')
       return next(new AppError(a ,400))
    }
   
    req.body.createdAt = new Date(Date.now())
    const newUser = await createUser(req.body);
    resp.status(201).json({
        satatus: 'success',
        data: {
            user : newUser
        }
    })
})

const getMe = catchReqResAsync(async (req,resp, next)=>{
    const newUser = await getUser(req.params.id);
    resp.status(201).json({
        satatus: 'success',
        data: {
            user : newUser
        }
    })
})

const fetchUserByEmail = catchReqResAsync(async (req,resp, next)=>{
    const newUser = await getUserByEmail(req.body.primaryEmail);
    resp.status(201).json({
        satatus: 'success',
        data: {
            user : newUser
        }
    })
})

export {getMe,signup,fetchUserByEmail}