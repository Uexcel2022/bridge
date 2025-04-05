export const timeZone = async ()=>{
    return new Date(Date.now() 
    + (new Date().getTimezoneOffset()*-1)*60*1000)
}