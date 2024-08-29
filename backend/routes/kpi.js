import express from 'express';
const router = express.Router();

import {
    getGroups
} from '../controllers/kpiController.js'

//GET all KPI data
router.get("/",getGroups)



export default router;