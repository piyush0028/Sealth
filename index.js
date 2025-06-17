const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const { setupWebSocket } = require('./websocket/socketHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API working!'));

app.use('/enrollments', require('./routes/enrollments'));
app.use('/chat', require('./routes/chat'));

const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`HTTP and WebSocket server running on port ${PORT}`);
});
