import { Socket } from "socket.io";
import cloudinary from "../lib/Cloudinary.js";
import { getReceiverId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllUsersForSideBar = async (req, res) => {
  try {
    const userId = req.user._id;
    const getAllUsers = await User.find({_id : {$ne : userId}}).select("-password");  

    if (getAllUsers) {
        return res.status(200).json({
          success : true,
          message : getAllUsers 
        })
    }else {
      return res.status(400).json({
        success : false , 
        message : "userid is not correct"
      })
    }
  }catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
}
export const getMessages = async (req , res) => {
    const {id : receiverId} = req.params
    const myid = req.user._id;
    try {
        const messages = await Message.find({
          $or : [
            {
                senderId : myid , receiverId : receiverId
            }, {
                senderId : receiverId , receiverId : myid
            }
          ]
        })
        if (!messages) res.status(404).json({
          success : false , 
          message : "no messages found"
        })
        return res.status (200).json({
          success : true ,
          message : messages
        })
    }catch(err) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const sendMessages = async (req , res) => {
    const {id : receiverId} = req.params
    const myid = req.user._id;
    const {text , image} = req.body

    try {
        let imageUrl = null
        if (image) {
          const imageCloudary = await cloudinary.uploader.upload(image);
          imageUrl = imageCloudary.secure_url 
        }
        const newMessage = await Message.create({
            senderId : myid,
            receiverId : receiverId,
            text : text,
            image : imageUrl
        })
        await newMessage.save();

        // socket.io implementaiton

        const receiverid = getReceiverId(receiverId);

        if (receiverid) {
            io.to(receiverid).emit("newMessage" ,newMessage )
        }

        return res.status(200).json({
          success : true ,
          message : "message sent successfully",
          data : newMessage
        })
    } catch (error) {
       return res.status(500).json({ success: false, message: error.message });
    }
}