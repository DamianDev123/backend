const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const auth = require("./auth");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 3001;
// Middleware
app.use(express.json());
app.use(cookieParser());
// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// Connect to MongoDB
mongoose.connect('mongodb+srv://WhoEnters:'+'raining1iq'+'@whoisthere.rnwvasa.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
  serverSelectionTimeoutMS: 30000, // Increase the timeout to 30 seconds
});

const db = mongoose.connection
db.once('open', () => {
  console.log('Database connected')
})
// Use auth routes
app.use('/auth', authRoutes);

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});


// authentication endpoint
app.get("/auth-endpoint", auth,(request, response) => {
  response.json({ message: "You are authorized to access me" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 