const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" DB error", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
