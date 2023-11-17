const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
  first_name: { type: String, required: true, length: { min: 3 } },
  last_name: { type: String, required: true, length: { min: 3 } },
  username: { type: String, required: true, length: { min: 3 } },
  password: { type: String, required: true },
  membership_status: { type: String, enum: ["admin", "member", "outsider"] },
})

UserSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`
})

UserSchema.virtual("url").get(function () {
  return `/users/${this._id}`
})

module.exports = mongoose.model("User", UserSchema)