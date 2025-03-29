const express = require('express');
const cors = require('cors');
const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const tableRoutes = require('./routes/tables');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const reservationRoutes = require('./routes/reservations');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 