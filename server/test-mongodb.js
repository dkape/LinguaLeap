const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ name: 'Connection Test' });
    await testDoc.save();
    
    console.log('✅ Test document created successfully!');
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up!');
    
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

testConnection();