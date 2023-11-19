const mongoose = require("mongoose")
const Schema = mongoose.Schema
const dayjs = require("dayjs")

const validateText = (text) => text.length > 0

const PostSchema = new Schema({
  title: { type: String, required: true, length: { min: 3 } },
  text: { type: [String], required: true, validate: validateText },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, required: true, default: Date.now() },
})

PostSchema.virtual("url").get(function () {
  return `/posts/${this._id}`
})

PostSchema.virtual("formatted_date").get(function () {
  return dayjs(this.timestamp).format("DD/MM/YYYY")
})

module.exports = mongoose.model("Post", PostSchema)
