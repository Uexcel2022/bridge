process.env.TZ = Intl.DateTimeFormat().resolvedOptions().timeZone
import {app} from './app.js'

const PORT = process.env.PORT || 3000
const server = app.listen(PORT,()=>{
 console.log(`Server started at port: ${PORT}`)
});

process.on('unhandledRejection',(err)=>{
 console.log('Unhandled Rejection! Shutting down...')
 console.log(err.name,err.message)
 server.close(()=>{
     process.exit(1)
 })
})
