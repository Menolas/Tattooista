require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const errorMiddleware = require('./middlewares/errorMiddleware')

const fileUpload = require('express-fileupload')

const app = express()
const PORT = process.env.PORT || 3030

const customerRouter = require('./routes/CustomerRoutes')
const clientRouter = require('./routes/ClientRoutes')
const authRouter = require('./routes/AuthRoutes')
const galleryRouter = require('./routes/GalleryRoutes')
const categoryRouter = require('./routes/CategoryRoutes')
const faqRouter = require('./routes/FaqRoutes')
const serviceRouter = require('./routes/ServiceRoutes')
const pagesRouter = require('./routes/PagesRoutes')
//const rateLimit = require("express-rate-limit")

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use(fileUpload({createParentPath: true,}))
app.use('/', express.static(__dirname + '/uploads'))
app.use('/customers/', customerRouter)
app.use('/clients/', clientRouter)
app.use('/auth/', authRouter)
app.use('/gallery/', galleryRouter)
app.use('/category/', categoryRouter)
app.use('/faq/', faqRouter)
app.use('/services/', serviceRouter)
app.use('/pages/', pagesRouter)
app.use(errorMiddleware)

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });

const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))
    app.listen(PORT, () => console.log('Server started!'))
  } catch (e) {
    console.log(e)
  }
}

start();


