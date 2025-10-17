import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    // Extract and verify the JWT
    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("✅ Decoded token:", decoded);

    const email = decoded.email; // ✅ Your token contains email, not id

    // Connect to MySQL
    const connection = await mysql.createConnection({
     host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    console.log("✅ Connected to MySQL");

    // Look up user by email instead of id
    const [rows]: any = await connection.execute(
      "SELECT userName FROM users WHERE email = ?",
      [email]
    );

    console.log("🧾 Query result:", rows);

    if (!rows.length) {
      console.error("❌ No user found for email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userName = rows[0].userName;

    return NextResponse.json({ userName });
  } catch (err: any) {
    console.error("Error fetching username:", err);
    return NextResponse.json({ error: "Failed to fetch username" }, { status: 500 });
  }
}
