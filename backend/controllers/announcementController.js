import sql from "mssql";
import dotenv from "dotenv";

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

//GET ALL Annoucement
export async function getAllAnnouncement(req, res) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const result = await request.query(
      "SELECT * FROM [Announcement] ORDER BY CreatedAt DESC"
    );
    res.status(200).json(result.recordsets);
  } catch (err) {
    console.error("Error querying announcement data: ", err);
    res.status(500).send("Error querying data");
  }
}

//GET a single Announcement
export async function getAnnouncement(req, res) {
  const { Id } = req.params;

  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const result = await request
      .input("Id", sql.Int, Id)
      .query("SELECT * FROM [Announcement] WHERE Id = @Id");

    res.status(200).json(result.recordsets);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error get an announcement");
  }
}

//Create an Announcement
export async function createAnnouncement(req, res) {
  const { Text, AuthorId } = req.body;

  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const result = await request
      .input("Text", sql.NVarChar, Text)
      .input("AuthorId", sql.Int, AuthorId)
      .query(
        "INSERT INTO  [Announcement] (Text, AuthorId, CreatedAt) OUTPUT INSERTED.Id VALUES (@Text, @AuthorId, GETUTCDATE())"
      );

    const newAnnouncementResult = await request
      .input("Id", sql.Int, result.recordset[0].Id)
      .query("SELECT * FROM [Announcement] WHERE Id = @Id");
    const newAnnouncement = newAnnouncementResult.recordset[0];

    res.status(200).send(newAnnouncement);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error creating announcement");
  }
}

// DELETE Announcement
export async function deleteAnnouncement(req, res) {
  const { Id } = req.params;
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    const result = await request
      .input("Id", sql.Int, Id)
      .query("DELETE FROM [Announcement] WHERE Id = @Id");

    if (result.length === 0) {
      return res.status(404).json({ error: "Announcement Data not found" });
    }

    res.status(200).json("Announcement deleted successfully");
  } catch (error) {
    console.error("Error deleting the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
