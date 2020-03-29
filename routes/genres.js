const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Genre, validateGenre } = require('../models/genre')

mongoose.connect('mongodb://localhost/playground', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err))

router.get('/', (req, res) => {
    const genres = await Genre
        .find()
        .select('id name')
    res.send(genres)
})

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const genre = new Genre({
        name: req.body.name,
    })
    try {
        const result = await genre.save()
        console.log(`Saved new Genre ${req.body.name}...`)
        res.send(result)
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message)
    }
})

router.put('/:id', (req, res) => {
    try {
        const genre = await Genre.findOne({ _id: req.params.id })
        genre.set({
            name: req.body.name
        })
        const result = await genre.save()
        console.log(`Updated Genre ${req.params.id}, set name to: ${req.body.name}...`)
        res.send(result)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Genre ID')
    }
})

router.get('/:id', (req, res) => {
    try {
        const genre = await Genre
            .findOne({ _id: req.params.id })
            .select('id name')
        res.send(genre)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Genre ID')
    }
})

router.delete('/:id', (req, res) => {
    try {
        const genre = await Genre.findByIdAndRemove(req.params.id)
        res.send(genre)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Genre ID')
    }
})

module.exports = router