require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const errorMiddleware = require('./middlewares/errorMiddleware');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 3030;

const bookingRouter = require('./routes/BookingRoutes');
const clientRouter = require('./routes/ClientRoutes');
const authRouter = require('./routes/AuthRoutes');
const galleryRouter = require('./routes/GalleryRoutes');
const stylesRouter = require('./routes/StylesRoutes');
const faqRouter = require('./routes/FaqRoutes');
const serviceRouter = require('./routes/ServiceRoutes');
const pagesRouter = require('./routes/PagesRoutes');
const usersRouter = require('./routes/UsersRoutes');
const rateLimit = require("express-rate-limit");

mongoose.set('strictQuery', false);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(fileUpload({createParentPath: true,}));
app.use('/', express.static(__dirname + '/uploads'));

const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

//Routes
app.use('/bookings/', bookingRouter);
app.use('/clients/', clientRouter);
app.use('/auth/', authRouter);
app.use('/gallery/', galleryRouter);
app.use('/tattooStyle/', stylesRouter);
app.use('/faq/', faqRouter);
app.use('/services/', serviceRouter);
app.use('/pages/', pagesRouter);
app.use('/users/', usersRouter);

app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.log('Connected to Database'));
    app.listen(PORT, () => console.log('Server started!'));
  } catch (e) {
    console.log(e);
  }
}

start();
