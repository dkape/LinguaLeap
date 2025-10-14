
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create tables if they don't exist
const createTables = async () => {
  const schema = require('fs').readFileSync('./config/schema.sql').toString();
  const queries = schema.split(';').filter(query => query.trim() !== '');
  for (const query of queries) {
    await pool.query(query);
  }
};

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the LinguaLeap server!');
});

app.listen(port, async () => {
  try {
    await createTables();
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
  console.log(`Server listening on port ${port}`);
});
