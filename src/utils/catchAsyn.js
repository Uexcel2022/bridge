
import { AppError } from "./appError.js";

function catchReqResAsync(fn){
    return(req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}

const catchDBAsync = fn => {
      return async (qualifs)=>{
    try{
        return await fn(qualifs);
      }catch(err){
        console.log(err);
        if(err.name=='PrismaClientValidationError'){
            const msg = err.message.split(/Argument|argument/)[1]
            .replace(':','').replace("`",'').replace("`",'');
            throw new AppError(msg.trim(),400)
        }
        if(err.name=='Error'){
            throw new AppError(err.message, err.statusCode)
        }

        if(err.code=='P2002'){
            throw new AppError(`The ${err.meta.target} has been used.`, 400)
        }

        if(err.code=='P2025'){
            const msg = err.meta.target || err.meta.cause
            throw new AppError(`${err.meta.cause}`, 400)
        }

      }
    }
}
export {catchReqResAsync,catchDBAsync}