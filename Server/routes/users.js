import express from "express"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { User } from '../model/User.js'
import { UserAttempts } from '../model/Userattempt.js'
import { login_messages as  msg, commons,validation_messages as mesg} from '../messages/messages.js'
import { checkArray, sendEmail } from '../mails/sendmail.js'
import { nanoid } from 'nanoid'

const router = express.Router()

router.post('/signup', async (req, res,next) => {
    try {
        var { username, email, password, pattern, sets, sequence } = req.body
    
        if (typeof sets === 'undefined' || typeof username === 'undefined' || typeof email === 'undefined' || typeof password === 'undefined' || typeof pattern === 'undefined') {
            return res.status(406).json({
                message: "Invalid parameters",
                format: "Check your request body"
            })
            return next()
        }

        let user = await User.findOne({ email: email })
        if (user) {
            return res.status(400).json({ error: "A user with this email already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            sets,
            pattern,
            sequence: false
        })

        const attempts = new UserAttempts({
            username,
            email,
            attempts: 0
        })

        const savedUser = await newUser.save()
        await attempts.save()

        const payload = {
            user: {
                id: savedUser._id,
                email: savedUser.email
            }
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "5d" })
        res.status(200).json({ token })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
})


router.post('/login',async (req,res,next)=>{
    try {
        var { username, password, pattern } = req.body
        if (typeof username === 'undefined' || typeof password === 'undefined' || typeof pattern === 'undefined') {
            res.status(406).json({
                message: commons.invalid_params,
                format: msg.format
            })
            return next()
        }

        let existingUser = await User.findOne({username: username})
        if (!existingUser) {
            res.status(401).json({message: msg.user_not_exist})
            return next()
        }

        const currentAttempts = await UserAttempts.findOne({username: username})
        if (currentAttempts.attempts > process.env.MAX_ATTEMPTS) {
            res.status(500).json({status: "blocked", message: "Your account has been blocked, please check email."})
            return next()
        }

        let isValidPassword = await bcrypt.compare(password, existingUser.password)
        let isValidPattern = checkArray(existingUser.pattern, pattern, true)
        if (!isValidPassword || !isValidPattern) {
            if (currentAttempts.attempts === Number(process.env.MAX_ATTEMPTS)) {
                await UserAttempts.findOneAndUpdate({username: username}, {attempts: currentAttempts.attempts+1, token: nanoid(32)}).catch(err => console.log(err))
                sendEmail(currentAttempts.email)
            }
            await UserAttempts.findOneAndUpdate({username: username}, {attempts: currentAttempts.attempts+1}).catch(err => console.log(err))
            res.status(500).json({message: msg.invalid_credentials})
            return next()
        }
        const payload = {
            user: {
                id: existingUser._id,
                email: existingUser.email
            }
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "5d" })
        await UserAttempts.findOneAndUpdate({username: username}, {attempts: 0}).catch(err => console.log(err))
        res.status(200).json({ token })
        

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }

})

router.get('/check',async (req, res, next) => {
    var {username, email} = req.query
    let user
    if (typeof username === 'undefined' && typeof email === 'undefined') {
        res.status(500).json({
            message: commons.invalid_params,
            format: "username or email"
        })
        return next()
    }
    
    if (typeof email === 'undefined') {
        // username = username.toLowerCase()
        try{ 
            user = await User.findOne({username: username}) 
        }catch (err) { 
            res.status(400).json({message: mesg.search_err}) 
        }
        if (user) res.status(200).json({exists: true})
        else res.status(200).json({exists: false})
    }
    else if (typeof username === 'undefined') {
        try { 
            user = await User.findOne({email: email}) 
        }catch (err) { 
            res.status(400).json({message: mesg.search_err}) 
        }
        if (user) res.status(200).json({exists: true})
        else res.status(200).json({exists: false})
    }
})

export { router }
