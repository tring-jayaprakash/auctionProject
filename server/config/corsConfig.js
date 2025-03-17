const cors = require('cors');

const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST'], 
    
};

module.exports = cors(corsOptions);
