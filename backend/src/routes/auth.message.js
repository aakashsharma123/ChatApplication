import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {getAllUsersForSideBar} from '../controllers/auth.message.controller.js'


const router = express.Router();

router.get("/getAllUsers" , protectRoute , getAllUsersForSideBar);

export default router;