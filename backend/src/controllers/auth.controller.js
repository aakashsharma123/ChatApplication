import { generateToken } from "../lib/auth.token.js";
import cloudinary from "../lib/Cloudinary.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;

  if (!email) {
    return res.status(404).json({ success: false, message: "email required" })
  }

  if (password.length < 6) {
    return res.status(404).json({ success: false, message: "password should be aleast 6 characters" })
  }

  if (!fullName) {
    return res.status(404).json({ success: false, message: "fullname is required" })
  }


  try {
    const findUser = await User.findOne({ fullName })

    if (!findUser) {

      const newUser = await User.create({
        fullName,
        email,
        password: bcrypt.hashSync(password, 10),
        profilePic
      })

      if (newUser) {
        //generate jwt token 
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
          success: true, message: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
          }
        })
      }

    } else {
      res.status(404).json({ success: false, message: "user already present please login " })
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err })
  }
}


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ success: false, message: "All fields required" })
  }

  try {
    const userfind = await User.findOne({ email })

    if (!userfind) {
      return res.status(400).json({ success: false, message: "u are not registed first signup " })
    }
    const passwordCheck = await bcrypt.compare(password, userfind.password);

    if (!passwordCheck) {
      return res.status(400).json({ success: false, message: "invalid credentials" })
    }

    generateToken(userfind._id, res)

    res.status(201).json({
      success: true, message: {
        id: userfind._id,
        fullName: userfind.fullName,
        email: userfind.email,
        profilePic: userfind.profilePic
      }
    })

  } catch (err) {
    res.status(500).json({ success: false, message: err })
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ success: true, message: "logout successfully " })
  } catch (error) {
    res.status(500).json({ success: false, message: err })
  }
}

export const updateProfile = async () => {
  const { profilePic } = req.body;

  if (!profilePic) {
    return res.status(404).json({
      success: false,
      message: "profile pic needed"
    })
  }

  const userId = req.user._id

  try {
    const cloudinaryReponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: cloudinaryReponse.secure_url }, { new: true })

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "something went wrong while uploading image to database"
      })
    }

    res.status(200).json({
      success: true,
      message: updatedUser
    })

  } catch (err) {
    console.log("err ---", err);
    res.status(500).json({ success: false, message: err })
  }
} 

export const checkAuth = async (req, res) => {
  const userId = req.user._id;
  console.log("userid - check" , userId)
  try {
    const updatedUser = await User.findById(userId).select("-password")

    return res.status(200).json({
      success: true,
      message: updatedUser
    });
  } catch (error) {
    console.log("err ---", error);
    res.status(500).json({ success: false, message: error.message });
  }
};