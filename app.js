const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middlewares/errorHandler');
const usersRoutes = require('./routes/usersRoutes');
const infosRoutes = require('./routes/infosRoutes');
const statesRoutes = require('./routes/statesRoutes');
const feedbacksRoutes = require('./routes/feedbacksRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/users', usersRoutes);
app.use('/api/infos', infosRoutes);
app.use('/api/states', statesRoutes);
app.use('/api/feedbacks', feedbacksRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// SPA fallback - serve index.html for non-API routes
app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
    } else {
        next();
    }
});

app.use(errorHandler);

module.exports = app;