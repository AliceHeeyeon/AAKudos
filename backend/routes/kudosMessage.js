import express from 'express';
const router = express.Router();

import {
    getMessages,
    createMessage,
    updateMessage
} from '../controllers/kudosMessageController.js'

//GET all users
router.get("/", getMessages)
router.post('/', createMessage)
router.put("/:Id", updateMessage)

export default router;