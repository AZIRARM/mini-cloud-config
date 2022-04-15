const express = require('express');
const app = express();
require('dotenv').config();

const routes = require('./secrets');
const PORT = process.env.SECRETS_PORT ? process.env.SECRETS_PORT : 9000;

app.use(express.json());

app.use('/', routes);

app.listen(PORT, () => {
console.log("Mini Cloud Config is ready and listening at " + PORT)
})