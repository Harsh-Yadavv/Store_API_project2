const express = require('express')
const app = express()
require('dotenv').config()
const errorHandlerMiddlerware = require('./middlewares/error_handler')
const notFound = require('./middlewares/not_found')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')
require('express-async-errors')

const port = process.env.PORT || 3000;

//middlewares
app.use(express.json())


//routes
app.get('/', (req, res) => {
    res.send('<H1>Welcome to Store:</H1><a href="/api/v1/products">Products route</a>')
})
app.use('/api/v1/products', productsRouter)

app.use(errorHandlerMiddlerware)
app.use(notFound)

const start = async () => {
    try {
        await connectDB(process.env.connectionString)
        app.listen(port, console.log(`Server is running at port ${port}...`));
    } catch (error) {
        console.log(error)
    }
}

start();