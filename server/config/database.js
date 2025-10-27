const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).asPromise();

    console.log(`MongoDB Connected: ${conn.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;