const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "姓名未填"]
    },
    content: {
      type: String,
      required: [true, "內容未填"]
    },
    image: {
      type: String,
      default: ""
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const Post = mongoose.model("posts", postSchema);

module.exports = Post;