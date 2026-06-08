import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Admin ||
  mongoose.model("Admin", adminSchema);