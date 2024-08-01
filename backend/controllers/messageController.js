import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    server : process.env.MSSQL_HOST,
    database : process.env.MSSQL_DATABASE,
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    options: {
        encrypt: false
    }
}

export async function getMessages(req, res) {
    try {
        await sql.connect(config);
        console.log("Connection established successfully");

        const request = new sql.Request();
        const result = await request.query('SELECT * FROM [Message]');
        console.log(result)
        res.json(result.recordsets); 
    } catch (err) {
        console.error("Error querying data: ", err);
        res.status(500).send('Error querying data');
    }
}