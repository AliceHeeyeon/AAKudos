import express from 'express';
const router = express.Router();

import {
    getAllAnnouncement,
    getAnnouncement,
    createAnnouncement,
    deleteAnnouncement
} from '../controllers/announcementController.js'

//GET All Announcement
router.get('/', getAllAnnouncement)
//Get a single Announcement
router.get('/:Id', getAnnouncement)
//Create an Announcement
router.post('/', createAnnouncement)
//DELETE an Announcement
router.delete('/:Id', deleteAnnouncement)

export default router;