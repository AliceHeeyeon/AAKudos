import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import user from './routes/user.js';
import message from './routes/kudosMessage.js';
import kpi from './routes/kpi.js'
import announcement from './routes/announcement.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong')
})

//Attach Routes to the app
app.use("/api/user", user)
app.use("/api/message", message)
app.use("/api/kpi", kpi)
app.use("/api/announcement", announcement)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})