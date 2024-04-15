import express from 'express'
import { nanoid } from 'nanoid';
import { commons ,login_messages as msg } from '../messages/messages.js';
import { shuffleArray, unsplash } from '../mails/sendmail.js';
import {User} from '../model/User.js'
const router = express.Router()

router.get('/search',async (req, res, next) => {

    const { keyword } = req.query
    const pages = 3
    const images = []
    const splitArrays = []

    if (typeof keyword === 'undefined') {
        res.status(500).json({
            message: commons.invalid_params,
            format: "keyword"
        })
        return next()
    }

    for(let i=0; i<pages; i++) {
        const result = await unsplash.search.getPhotos({
            query: keyword,
            perPage: 30,
            orientation: 'landscape'
        })
        const resultsArray = result.response.results
        resultsArray.map(each => {
            images.push({
                id: nanoid(),
                url: each.urls.small
            })
        })
    }

    shuffleArray(images)

    for(let i=0; i<64; i+=16) {
        splitArrays.push(images.slice(i, i+16))
    }

    res.send(splitArrays)
})

router.get('/',async (req, res, next) => {
    
    var { username } = req.query
    let existingUser
    
    if (typeof username === 'undefined') {
        res.status(500).json({
            message: commons.invalid_params,
            format: "username"
        })
        return next()
    }

    try { 
        existingUser = await User.findOne({username: username}) 
    }catch(err) {
        console.log(err)
        res.status(401).json({message: "Error occured while fetching from DB"})
        return next()
    }

    if (!existingUser) {
        res.status(401).json({message: msg.user_not_exist})
        return next()
    }

    res.send(existingUser.sets)
} )

export { router }