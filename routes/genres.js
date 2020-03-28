const express = require('express')
const router = express.Router()
const Joi = require('@hapi/joi')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err))

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    }
})

const Genre = mongoose.model('Genre', genreSchema)

async function getGenres(res) {
    const genres = await Genre
        .find()
        .select('id name')
    res.send(genres)
}
router.get('/', (req, res) => {
    getGenres(res)
})

async function createGenre(name) {
    const genre = new Genre({
        name: name,
    })
    try {
        const result = await genre.save()
        console.log(`Saved new Genre ${name}...`)
        return result
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message)
    }
}
router.post('/', (req, res) => {
    // Validate POST request, if invalid return 400
    // { error } == result.error
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const result = createGenre(req.body.name)
    res.send(result)
})

async function updateGenre(res, id, name) {
    const genre = await Genre.findById(id)
    if (!genre) return
    genre.set({
        name: name
    })
    const result = await genre.save()
    console.log(`Updated Genre ${id}, set name to: ${name}...`)
    res.send(result)
}
router.put('/:id', (req, res) => {
    try {
        updateGenre(res, req.params.id, req.body.name)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Genre ID')
    }
})

async function getGenre(res, id) {
    try {
        const genre = await Genre
            .findOne({ _id: id })
            .select('id name')
        res.send(genre)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Genre ID')
    }
}
router.get('/:id', (req, res) => {
    getGenre(res, req.params.id)
})

async function deleteGenre(res, id) {
    const genre = await Genre.findByIdAndRemove(id)
    res.send(genre)
}
router.delete('/:id', (req, res) => {
    try {
        deleteGenre(res, req.params.id)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Genre ID')
    }
})

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate({ name: genre.name })
}

module.exports = router