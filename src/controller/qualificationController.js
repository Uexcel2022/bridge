import {createQualification} from '../services/qalificationService.js'
import {catchReqResAsync} from '../utils/catchAsyn.js'

const createQualif = catchReqResAsync(async(req,res,next)=>{
    const newQ = await createQualification(req.body)
    res.status(201).json({
        success: 'success',
        data:{
            qualification: newQ
        }
    })
})

export {createQualif}