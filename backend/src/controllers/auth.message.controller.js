import User from "../models/user.model.js";

export const getAllUsersForSideBar = async (req, res) => {
  try {
    const userId = req.user._id;
    const getAllUsers = await User.find({_id : {$ne : userId}}).select("-password")   
    console.log("allmessage" , getAllUsers)

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