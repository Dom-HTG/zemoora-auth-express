const express = require("express")
const jwt = require("jsonwebtoken")

const app = express()

const users = [
    {
        id: 1,
        name: "nice",
        email: "nice@test.com",
        pass: "nice"
    },
    {
        id: 2,
        name: "test",
        email: "test@test.com",
        pass: "nice"
    },
]

const secret = 'nice'

app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
    res.json({"message": "Home Page"})
})

app.post("/login", (req, res) => {
    const { email, pass} = req.body

    if(!email || !pass) {
        return res.status(400).json({ message: "invalid data"})
    }

    const user = users.find(user => user.email === email && user.pass === pass)

    if(!user) {
        return res.status(404).json({ message: "No user found"})
    }

    const token = jwt.sign({ id: user.id, name: user.name}, secret, { expiresIn: "2d"})

    return res.json({ token })
})

function authMiddleware(req, res, next) {
    try {
        const auth = req.headers.authorization
        // console.log({ auth })
        const token = auth.split(" ")[1]
        console.log({ token})

        const data = jwt.verify(token, secret )
        req.user = { email: data.email }
        next()

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message})
    }
}

app.post("/posts",authMiddleware, (req, res) => {
    // title, desc

    /**
     * create post array to hold post data. each data should be structured as such: { id, userId, title, desc}
     * create a validation pipeline to validate title and desc being sent from the request body
     * append post to post array. { id, userId, title, desc }
     * 
     * create a get route to load all current users post
     */

    return res.json({ post: { }})
})


app.listen(3030, () => {
    console.log('Server listening on port 3030')
})