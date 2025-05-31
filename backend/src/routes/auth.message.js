import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {getAllUsersForSideBar , getMessages ,  sendMessages} from '../controllers/auth.message.controller.js'


const router = express.Router();

router.get("/getAllUsers" , protectRoute , getAllUsersForSideBar);
router.get("/:id" , protectRoute , getMessages);
router.post("/:id" , protectRoute , sendMessages);

export default router;