import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import {connecttomongo} from './db.js'
import { router as userRoutes } from './routes/users.js'
import { VerifyRoute } from './routes/verify.js'
import { router as imageRoutes } from './routes/image.js'
import { router as contactRoutes } from './routes/contact.js'
import { EM } from './routes/EM.js'
dotenv.config()
connecttomongo()

const app=express();

app.use(cors())
app.use(express.json())
app.use('/api/user',userRoutes)
app.use('/api/verify', VerifyRoute)
app.use('/api/image', imageRoutes)
app.use('/api/contact',contactRoutes)
app.use('/api/em', EM)

app.listen(90,()=>{
    console.log("app listening at port 90")
})
