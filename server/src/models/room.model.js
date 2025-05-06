const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["private", "public"], required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  maxParticipants: { type: Number, default: 10 },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tags: [String],
  status: {
    type: String,
    enum: ["Scheduled", "Live", "Closed", "Completed"],
    default: "Scheduled", // Default to Scheduled when created
  },
});

module.exports = mongoose.model("Room", roomSchema);
