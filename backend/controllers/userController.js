import sql from 'mssql';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

function generateToken(user) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
}

// GET ALL USERS 
export async function getUsers(req, res) {
    try {
        await sql.connect(config);
        console.log("Connection established successfully");

        const request = new sql.Request();
        const result = await request.query('SELECT * FROM [User]');
        res.json(result.recordsets); 
    } catch (err) {
        console.error("Error querying data: ", err);
        res.status(500).send('Error querying data');
    }
}

// GET A SINGLE USER
export async function getUser(req, res) {
    const { id } = req.params;
    try {
        await sql.connect(config);

        const request = new sql.Request();
        request.input('id', sql.Int, id)
        const result = await request.query('SELECT * FROM [User] WHERE Id = @id');
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.recordsets); 
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//SIGN UP 
export async function signup(req, res) {
    const { name, email, password, role, joindate } = req.body;
    try {
        await sql.connect(config);

        const hashedPassword = await bcrypt.hash(password, 10);
        const request = new sql.Request();

        // Add a user
        await request.input('name', sql.NVarChar, name)
                     .input('email', sql.NVarChar, email)
                     .input('password', sql.NVarChar, hashedPassword)
                     .input('role', sql.NVarChar, role)
                     .input('joindate', sql.Date, joindate)
                     .query('INSERT INTO [User] (Name, Email, Password, Role, JoinDate) VALUES (@name, @email, @password, @role, @joindate)');

        // Search the new user
        const result = await request.query('SELECT * FROM [User] WHERE Email = @email');
        const newUser = result.recordsets[0]
        const token = generateToken(newUser);

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// LOGIN
export async function login(req, res) {
    const { email, password } = req.body;
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('email', sql.NVarChar, email);
        
        // Find a user using email
        const result = await request.query('SELECT * FROM [User] WHERE Email = @email');
        if (result.length === 0) {
            console.log('No user found with this email');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // if the user is found, compare the provide password with the bcrypt-hashed password stored for the user.
        const user = result.recordsets[0];
        const isMatch = await bcrypt.compare(password, user[0].Password)

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = generateToken(user);
        res.json({ user, token });
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}