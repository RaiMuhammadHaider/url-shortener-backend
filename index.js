import express from 'express'
import dotenv from 'dotenv'
import router from './router/user.route.js'
import { authenticationMiddleware } from './middleware/auth.middleware.js'
import urlRouter from './router/url.route.js'
dotenv.config()

const app = express()
const PORT  = process.env.PORT || 8000
// app.use(express.json())
// app.use('/user' , router)
// app.use(authenticationMiddleware)
// app.use(urlRouter)
app.use(express.json())

// ✅ Apply middleware first
app.use(authenticationMiddleware)

// Then mount routes
app.use('/user', router)
app.use(urlRouter)
app.get('/' , (req , res)=>{
    return res.json({
        message : 'Server is ruuning'
    })
})


app.listen(PORT , (req , res )=> {
    console.log('Server is running at port : ' , PORT);
    
})