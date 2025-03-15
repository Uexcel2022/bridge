import {app} from './app.js'

const PORT = process.env.SERVER_PORT || 3000

app.listen(PORT,'127.0.0.1',()=>{
 console.log(`Server started at port: ${PORT}`)
});