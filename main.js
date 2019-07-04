const express = require('express');
const path = require('path');
const cors = require('cors');
const registrationRoutes = require('./routes/public/registration');
const authRoutes = require('./routes/public/auth');
const bookRoutes = require('./routes/private/books');
const authMiddleware = require('./routes/middleware/decode-token');
const errorMiddleware = require('./routes/middleware/error-handling');
const _ = require('lodash');

const app = express();
const port = 3000;

// config middleware
app.use(cors());
app.use(express.json());

// public routes
app.use('/register', registrationRoutes);
app.use('/auth', authRoutes);

// authentication middleware
app.use(authMiddleware);

// public routes
app.use('/book', bookRoutes);

// Client bundle
app.get('/', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Error handling middleware
app.use(errorMiddleware.joiErrorMiddleware);
app.use(errorMiddleware.errorMiddleware);


app.listen(port, () => console.log(`my-books server running on port ${port}`));
