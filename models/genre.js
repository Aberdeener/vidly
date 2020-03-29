const Joi = require('@hapi/joi')
const mongoose = require('mongoose')

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    }
}))

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate({ name: genre.name })
}

exports.Genre = Genre
exports.validateGenre = validateGenre