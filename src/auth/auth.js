import { getRecruiter } from "../services/recruiterService.js";
import { catchReqResAsync } from "../utils/catchAsync.js";
import {promisify} from 'util'
import jwt from 'jsonwebtoken'
import { getUser } from "../services/userService.js";
import { authFieldFilter } from "../utils/fieldsFilter.js";
import { AppError } from "../utils/appError.js";

export const protect = catchReqResAsync(async(req,resp,next)=>{
    let token;
    let docKind;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1]
    }
    
    if(!token){
        return next(
            new AppError('You are not logged in. Please login to continue!',401))
    }
    
    const docodedToken = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    
    if(docodedToken.role === 'recruiter'){

       docKind = await getRecruiter(docodedToken.id);
    }else{
        docKind = await getUser(docodedToken.id);
    }            

    if(!docKind){
        return next(new AppError('The document associated with the token does not exist', 401))
    }
    
    const jwtIssuedTime = docodedToken.iat + new Date().getTimezoneOffset()*-1*60;
     
    if(docKind.passwordChangeAt !== null){
        const pwdChgTime = parseInt(docKind.passwordChangeAt.getTime()/1000,10)
      if(jwtIssuedTime < pwdChgTime){
        return next(new AppError('You changed password recently. Please login again.', 401))
      }
    }
    
    if(docodedToken.role === 'recruiter'){
        req.recruiter = await authFieldFilter(docKind)
    }else{
        req.user = await authFieldFilter(docKind);
    };

    next()
})

export const restrictTo = (...roles)=>{
    return(req,resp,next)=>{
       const role = req.user? req.user.role : req.recruiter.role
        if(!roles.includes(role)){
            return next(new AppError(
                'You do not have permission to perform this action',403)
            )
        }
        next();
    }
}