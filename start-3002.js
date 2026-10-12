// Start foreclosure server on port 3002 in production mode
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3002';
require('./server.js');
