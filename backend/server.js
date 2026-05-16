require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app = express();
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => { console.error('Mongo connection error', err); process.exit(1); });


app.use('/auth', authRoutes);
app.use('/api', dataRoutes);


const { requireAuth } = require('./middleware/auth');
app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, this is protected` });
});

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


setInterval(() => {
  const stocks = ['BTC', 'ETH', 'SOL', 'AAPL', 'GOOGL'];
  const stock = stocks[Math.floor(Math.random() * stocks.length)];
  const change = (Math.random() * 10 - 5).toFixed(2);
  const type = change > 0 ? 'HIKE' : 'DOWN';

  io.emit('price_update', {
    symbol: stock,
    change: change,
    type: type,
    message: `${stock} is ${type === 'HIKE' ? 'up' : 'down'} by ${Math.abs(change)}%`
  });
}, 10000);

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server running on ${port}`));
app.set('io', io);
// trigger restart
// restart again
// restart for delete account
