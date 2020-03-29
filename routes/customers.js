const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Customer, validateCustomer } = require('../models/customer')

mongoose.connect('mongodb://localhost/playground', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err))

router.get('/', (req, res) => {
    const customers = await Customer
        .find()
        .select('id name isGold phone')
    res.send(customers)
})

router.post('/', (req, res) => {
    // { error } == result.error
    const { error } = validateCustomer(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const Customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })
    try {
        const result = await customer.save()
        console.log(`Saved new Customer ${name}...`)
        res.send(result)
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message)
    }
})

router.put('/:id', (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
        customer.set({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        })
        const result = await customer.save()
        console.log(`Updated Customer ${req.body.id}.`)
        res.send(result)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Customer ID')
    }
})

router.get('/:id', (req, res) => {
    try {
        const customer = await Customer
            .findOne({ _id: req.params.id })
            .select('id name isGold phone')
        res.send(customer)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Customer ID')
    }
})

router.delete('/:id', (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id)
        res.send(customer)
    } catch (ex) {
        console.log(ex.message)
        res.send('Invalid Customer ID')
    }
})

module.exports = router