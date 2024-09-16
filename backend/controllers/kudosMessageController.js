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

export async function getMessages(req, res) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const result = await request.query("SELECT * FROM [KudosMessage]");
    res.json(result.recordsets);
  } catch (err) {
    console.error("Error querying data: ", err);
    res.status(500).send("Error querying data");
  }
}

export async function createMessage(req, res) {
  const { AuthorId, TargetId, Content } = req.body;
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const result = await request
      .input("AuthorId", sql.Int, AuthorId)
      .input("TargetId", sql.Int, TargetId)
      .input("Content", sql.NVarChar, Content)
      .query(
        "INSERT INTO  [KudosMessage] (AuthorId, TargetId, Content, CreatedAt) OUTPUT INSERTED.Id VALUES (@AuthorId, @TargetId, @Content, SYSDATETIME())"
      );

    const newMessageResult = await request
      .input("Id", sql.Int, result.recordset[0].Id)
      .query("SELECT * FROM [KudosMessage] WHERE Id = @Id");
    const newMessage = newMessageResult.recordset;

    res.status(201).send(newMessage[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error posting Message");
  }
}

export async function updateMessage(req, res) {
  const { Id } = req.params;
  const { AuthorId, TargetId, Content } = req.body;

  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    await request
      .input("Id", sql.Int, Id)
      .input("AuthorId", sql.Int, AuthorId)
      .input("TargetId", sql.Int, TargetId)
      .input("Content", sql.NVarChar, Content)
      .query(
        "UPDATE [KudosMessage] SET AuthorId = @AuthorId, TargetId = @TargetId, Content = @Content, UpdatedAt = SYSDATETIME() WHERE Id = @id"
      );

    const result = await request.query(
      `SELECT * FROM [KudosMessage] WHERE Id = ${Id}`
    );
    const updatedMessage = result.recordset;

    if (updateMessage.length > 0) {
      res.json(updatedMessage[0]);
    } else {
      res.status(404).send("Message not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating message");
  }
}
