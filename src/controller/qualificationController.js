import {createQualification,updateQualif,deleteQualif} from '../services/qalificationService.js'
import {catchReqResAsync} from '../utils/catchAsyn.js'

export const createQualif = catchReqResAsync(async(req,res,next)=>{
    req.body.userId = req.user.id;
    const newQ = await createQualification(req.body)
    res.status(201).json({
        success: 'success',
        data:{
            qualification: newQ
        }
    })
})

export const qualifUpdate = catchReqResAsync(async(req,res,next)=>{
    req.body.qfId = req.params.id*1;
    req.body.userId = req.user.id;
    const updatedQal = await updateQualif(req.body)
    res.status(200).json({
        success: 'success',
        data:{
            qualification: updatedQal
        }
    })
})

export const deleteQaulif = catchReqResAsync(async(req,res,next)=>{
    await deleteQualif(req.params.id*1)
    res.status(204).json({
        success: 'success',
        data:{
            qualification: null
        }
    })
})
