const express = require('express');
const cors = require('cors');
const shoeRoutes = require('./routes/shoeRoutes');
const app = express();
const port = 3003;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Routes
app.use('/shoes', shoeRoutes);

// Basic Hello World for the home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
