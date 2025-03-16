const cors = require('cors');

const corsOptions = {
    origin: '*', // Allow all origins (customize as needed)
    methods: ['GET', 'POST'], // Allow specific HTTP methods
};

module.exports = cors(corsOptions);
