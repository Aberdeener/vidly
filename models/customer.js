const Joi = require('@hapi/joi')
const mongoose = require('mongoose')

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    isGold: {
        type: Boolean,
        default: false,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 10
    }
}))

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(10).required()
    })
    return schema.validate({
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone
    })
}

exports.Customer = Customer
exports.validateCustomer = validateCustomer