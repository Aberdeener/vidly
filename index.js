const Joi = require('@hapi/joi');
const express = require('express');
const app = express();
app.use(express.json());
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const home = require('./routes/home')
const port = process.env.PORT || 3000;

app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/', home)

app.listen(port, () => console.log(`Listening on port ${port}...`));