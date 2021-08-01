require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const DB_URL = process.env.MONGO_URL;
const authRoutes = require('./routes/authRoutes');


//middlewares
app.use(cors());
app.use(express.json());

// import routes
app.use('/api', authRoutes);

// Database connection
mongoose.connect(DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected successfully...');
}).catch(() => {
    console.log('Error while connecting to the database..');
});

// Server connection

app.listen(PORT, (result, err) => {
    if (err) {
        console.log(`Error while connecting to the database. ${ err }`);
    }
    console.log(`Server is running and up on PORT: ${ PORT }`);
});
