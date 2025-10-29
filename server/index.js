
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const classRoutes = require('./routes/classes');
const challengeRoutes = require('./routes/challenges');
const learningPathRoutes = require('./routes/learning-paths');

const app = express();
app.set('trust proxy', 1); // Trust reverse proxy
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:9002', 'https://kapeplus.de:9002'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/learning-paths', learningPathRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the LinguaLeap server!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
