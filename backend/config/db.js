const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows / ISP DNS SRV resolution querySrv ECONNREFUSED error
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']);
} catch (e) {
  // Fallback to default system DNS if custom resolver setting fails
}

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ DB Connection Warning (Attempt ${retryCount + 1}): ${error.message}`);
    
    // Retry connection automatically without crashing Node / nodemon process
    console.log('🔄 Retrying MongoDB connection in 5 seconds...');
    setTimeout(() => {
      connectDB(retryCount + 1);
    }, 5000);
  }
};

module.exports = connectDB;
