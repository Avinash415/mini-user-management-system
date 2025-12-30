const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// ❗ Only start server if NOT running tests
if (require.main === module && process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = startServer;
