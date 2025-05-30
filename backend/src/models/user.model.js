import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unqiue: true
  },


  password: {
    type: String,
    minlength: 6,
    required: true
  },

  profilePic: {
    type: String,
    default: ""
  },

}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User