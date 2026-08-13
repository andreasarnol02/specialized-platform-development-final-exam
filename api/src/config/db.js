const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Menghubungkan ke MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Terhubung");
  } catch (error) {
    console.error("❌ Error MongoDB");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error(error);

    process.exit(1);
  }
};

module.exports = connectDB;
