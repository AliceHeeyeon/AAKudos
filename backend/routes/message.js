import express from 'express';
const router = express.Router();

import {
    getMessages
} from '../controllers/messageController.js'

//GET all users
router.get("/", getMessages)

export default router;