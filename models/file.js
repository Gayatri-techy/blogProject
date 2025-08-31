const mongoose = require("mongoose");

// UserSchema Creation
const fileSchema = new mongoose.Schema(
  {url: { type: String, required: true },
    public_id: { type: String, required: true },
    uploaded_by: {type: mongoose.Schema.Types.ObjectId,required: true, ref: "User",}
  },
  {
    timestamps: true,
  }
);

// Model Creation
const File = mongoose.model("File", fileSchema);

module.exports = File;
