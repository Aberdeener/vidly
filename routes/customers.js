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

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    isGold: {
        type: Boolean,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 10
    }
})

const Customer = mongoose.model('Customer', customerSchema)

async function getCustomers(res) {
    const customers = await Customer
        .find()
        .select('id name isGold phone')
    res.send(customers)
}
router.get('/', (req, res) => {
    getCustomers(res)
})

async function createCustomer(name, isGold, phone) {
    const Customer = new Customer({
        name: name,
        isGold: isGold,
        phone: phone
    })
    try {
        const result = await customer.save()
        console.log(`Saved new Customer ${name}...`)
        return result
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message)
    }
}
router.post('/', (req, res) => {
    // Validate POST request, if invalid return 400
    // { error } == result.error
    const { error } = validateCustomer(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const result = createCustomer(req.body.name, req.body.isGold, req.body.phone)
    res.send(result)
})

async function updateCustomer(res, id, name, isGold, phone) {
    const customer = await Customer.findById(id)
    if (!customer) return
    customer.set({
        name: name,
        isGold: isGold,
        phone: phone
    })
    const result = await customer.save()
    console.log(`Updated Customer ${id}.`)
    res.send(result)
}
router.put('/:id', (req, res) => {
    try {
        updateCustomer(res, req.params.id, req.body.name, req.body.isGold, req.body.phone)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Customer ID')
    }
})

async function getCustomer(res, id) {
    try {
        const customer = await Customer
            .findOne({ _id: id })
            .select('id name isGold phone')
        res.send(customer)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Customer ID')
    }
}
router.get('/:id', (req, res) => {
    getCustomer(res, req.params.id)
})

async function deleteCustomer(res, id) {
    const customer = await Customer.findByIdAndRemove(id)
    res.send(customer)
}
router.delete('/:id', (req, res) => {
    try {
        deleteCustomer(res, req.params.id)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Customer ID')
    }
})

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

module.exports = router