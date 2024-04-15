import express from "express"
import { Contact } from "../model/Contact.js"

const router = express.Router()

router.post('/', async (req, res, next) => {
    
    const {name, email, message} = req.body

    if (typeof name === 'undefined' || typeof email === 'undefined' || typeof message === 'undefined') {
        res.status(406).json({
            message: commons.invalid_params,
            format: "[name, email, message]"
        })
        return next()
    }

    const contactFormat = new Contact({name, email, message})

    try {
        await contactFormat.save()
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error saving into database."})
        return next()
    }

    res.status(200).json({message: "Saved"})
})

export { router }