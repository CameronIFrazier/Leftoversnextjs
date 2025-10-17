import mysql from "mysql2/promise";

export async function POST(req: Request) {
  try {
    console.log("POST request received");

    const body = await req.json();
    console.log("Request body:", body);

    const { firstname, lastname, email, password, userName } = body;

    // Quick validation
    if (!firstname || !lastname || !email || !password || !userName) {
      console.log("Missing fields");
      return new Response(
        JSON.stringify({ success: false, error: "Missing fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Connecting to MySQL...");

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    console.log("Connected to MySQL");

    // Insert the new user with userName included
    const [result] = await connection.query(
      "INSERT INTO users (firstname, lastname, email, password, userName) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, password, userName]
    );

    console.log("Insert result:", result);

    await connection.end();
    console.log("Connection closed");

    return new Response(
      JSON.stringify({ success: true, message: "User added!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
