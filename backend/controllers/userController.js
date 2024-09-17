import sql from "mssql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const config = {
  server: process.env.MSSQL_HOST,
  database: process.env.MSSQL_DATABASE,
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  options: {
    encrypt: false,
  },
};

function generateToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id: user.id, username: user.username }, secret, {
    expiresIn: "1h",
  });
}

//GET ALL USERS INCLUDE DELETED STAFFS
export async function getUsersIncludeAll(req, res) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const result = await request.query("SELECT * FROM [User]");
    res.status(200).json(result.recordsets);
  } catch (err) {
    console.error("Error querying data: ", err);
    res.status(500).send("Error querying data");
  }
}

// GET ALL AVAILABLE USERS
export async function getUsers(req, res) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const result = await request.query(
      "SELECT * FROM [User] WHERE IsDeleted = 0"
    );
    res.status(200).json(result.recordsets);
  } catch (err) {
    console.error("Error querying data: ", err);
    res.status(500).send("Error querying data");
  }
}

// GET A SINGLE USER
export async function getUser(req, res) {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    request.input("id", sql.Int, id);
    const result = await request.query("SELECT * FROM [User] WHERE Id = @id");

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.recordsets);
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// CREATE USER
export async function createUser(req, res) {
  const { email, name, role, joinDate, password, dob } = req.body;
  try {
    const pool = await sql.connect(config);

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let request = pool.request();

    // Add a user
    const result = await request
      .input("Name", sql.NVarChar, name)
      .input("Email", sql.NVarChar, email)
      .input("Role", sql.NVarChar, role)
      .input("JoinDate", sql.Date, joinDate)
      .input("Password", sql.NVarChar, hashedPassword)
      .input("DOB", sql.Date, dob)
      .input("Permission", sql.Int, role === "system" ? 1 : 0)
      .input("IsDeleted", sql.Bit, 0)
      .query(
        "INSERT INTO [User] (Name, Email, Role, JoinDate, Password, DOB, Permission, IsDeleted) OUTPUT INSERTED.Id VALUES (@Name, @Email, @Role, @JoinDate, @Password, @DOB, @Permission, @IsDeleted)"
      );

    const newUserId = result.recordset[0].Id;

    // Retrieve the newly created user
    request = pool.request();
    let newUserResult = await request
      .input("Id", sql.Int, newUserId)
      .query("SELECT * FROM [User] WHERE Id = @Id");

    let newUser = newUserResult.recordset[0];
    //const newUserRole = newUser.Role;

    // If UserRole includes 'System' set Permission is true
    // if (newUserRole.includes("System")) {
    //   request = pool.request();
    //   await request
    //     .input("Id", sql.Int, newUser.Id)
    //     .query(`UPDATE [User] SET Permission = 1 WHERE Id = @Id`);

    // Then retrieve the updated user
    request = pool.request();
    newUserResult = await request
      .input("Id", sql.Int, newUser.Id)
      .query("SELECT * FROM [User] WHERE Id = @Id");
    newUser = newUserResult.recordset[0];
    // }

    const token = generateToken(newUser);
    res.status(200).json({ user: newUser, token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// LOGIN
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    request.input("email", sql.NVarChar, email);

    // Find a user using email
    const result = await request.query(
      "SELECT * FROM [User] WHERE Email = @email"
    );

    if (result.length === 0) {
      console.log("No user found with this email");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // if the user is found, compare the provide password with the bcrypt-hashed password stored for the user.
    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      console.log("password is not match");
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = generateToken(user);
    console.log(token);

    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// DELETE USER
export async function deleteUser(req, res) {
  const { Id } = req.params;
  try {
    const pool = await sql.connect(config);

    const request = pool.request();
    const result = await request
      .input("Id", sql.Int, Id)
      .query("UPDATE [User] SET IsDeleted = 1 WHERE Id = @Id");

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json("User deleted successfully");
  } catch (error) {
    console.error("Error deleting the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// EDIT USER
export async function editUser(req, res) {
  const { Id } = req.params;
  const { Name, Email, Role, JoinDate, DOB } = req.body;
  try {
    const pool = await sql.connect(config);

    let request = pool.request();
    await request
      .input("Id", sql.Int, Id)
      .input("Name", sql.NVarChar, Name)
      .input("Email", sql.NVarChar, Email)
      .input("Role", sql.NVarChar, Role)
      .input("JoinDate", sql.Date, JoinDate)
      .input("DOB", sql.Date, DOB)
      .query(
        "UPDATE [User] SET Name = @Name, Email = @Email, Role = @Role, JoinDate = @JoinDate, DOB = @DOB WHERE Id = @Id"
      );

    const result = await request.query(`SELECT * FROM [User] WHERE Id = @Id`);
    const updatedUserInfo = result.recordset[0];

    res.status(200).json(updatedUserInfo);
  } catch (error) {
    console.error("Error updating the user info :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// CHANGE USER's Permission
export async function changePermissionOfUser(req, res) {
  const { Id } = req.params;
  const { Permission } = req.body;
  try {
    const pool = await sql.connect(config);

    let request = pool.request();
    await request
      .input("Id", sql.Int, Id)
      .input("Permission", sql.Bit, Permission)
      .query("UPDATE [User] SET Permission = @Permission WHERE Id = @Id");

    const result = await request.query(`SELECT * FROM [User] WHERE Id = @Id`);
    const updatedUserInfo = result.recordset[0];

    res.status(200).json(updatedUserInfo);
  } catch (error) {
    console.error("Error updating the user info :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//CHANGE Password
export async function changePassword(req, res) {
  const { Id } = req.params;
  const { Password, NewPassword } = req.body;
  try {
    const pool = await sql.connect(config);

    let request = pool.request();
    // Find a user using id
    const user = await request
      .input("Id", sql.Int, Id)
      .query("SELECT * FROM [User] WHERE Id = @Id");

    if (user.length === 0) {
      console.log("No user found");
      return res.status(500).json({ error: "NO USER FOUND" });
    }

    // Compare password
    const userPassword = user.recordset[0].Password;
    const isMatch = await bcrypt.compare(Password, userPassword);

    //If they are matched, update password
    const hashedNewPassword = await bcrypt.hash(NewPassword, 10);
    if (isMatch) {
      await request
        .input("Password", sql.NVarChar, hashedNewPassword)
        .query("UPDATE [User] SET Password = @Password WHERE Id = @Id");

      res.status(200).json("Password Updated");
    } else {
      res.status(401).json("Current password is not matched");
    }
  } catch (error) {
    console.error("Error updating Password :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
