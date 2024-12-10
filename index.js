const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const { limiter } = require('../backend/middlewares/tokenAuthentication');

// Load environment variables from .env file
dotenv.config();


const corsConfig = {
  origin: process.env.CORS_ORIGINS.split(','), // Split the string into an array
  credentials: true,
  methods: ["*"] // You can change this as needed
};
// Port configuration
const PORT = process.env.SERVER_PORT || 8080;

const app = express();

// Middleware

app.use(express.json());
app.use(cors(corsConfig));
app.use(express.static('public'));
// app.use(limiter);
// Import routes
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const deliverDetailsRoute = require('./routes/deliveryDetailsRoutes');
const cartRoute = require('./routes/cartRoute');
const productRoute = require('./routes/productRoute')
const feedbackRoute = require('./routes/feedbackRoute')
const imageRoute = require('./routes/imageRoute')
const userInfoRoute = require('./routes/userInfoRoute')
const ordersRoute = require('./routes/ordersRoute')
const mongoRoute = require('./routes/mongoRoute')
const reportRoute = require('./routes/reportRoute')

// Use routes
app.use(userRoute);
app.use(adminRoute);
app.use(deliverDetailsRoute);
app.use(cartRoute);
app.use(productRoute);
app.use(feedbackRoute);
app.use(imageRoute);
app.use(userInfoRoute);
app.use(ordersRoute);
app.use(mongoRoute);
app.use(reportRoute)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
