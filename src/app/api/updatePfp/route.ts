import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import mysql, { RowDataPacket } from "mysql2/promise";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

type UserRow = RowDataPacket & {
  profile_pic: string | null;
};

export const POST = async (req: NextRequest) => {
  // Extract token
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ success: false, error: "No token" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];

  let email: string;
  try {
    const payload = verify(token, process.env.JWT_SECRET!) as { email: string };
    email = payload.email;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("pfp") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    // Setup S3 client
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    // Get old profile picture URL
    const [rows] = await connection.execute<UserRow[]>(
      "SELECT profile_pic FROM users WHERE email = ?",
      [email]
    );
    const oldUrl = rows[0]?.profile_pic;

    // Delete old uploaded PFP if exists and not a default
    if (oldUrl && !oldUrl.includes("defaults/")) {
      const oldKey = oldUrl.split(".com/")[1];
      await s3.send(new DeleteObjectCommand({ Bucket: "leftoversnextjsbucket", Key: oldKey }));
    }

    // Upload new file
    const s3Key = `user-pfps/${file.name}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: "leftoversnextjsbucket",
        Key: s3Key,
        Body: Buffer.from(arrayBuffer),
        ContentType: file.type || undefined,
      })
    );

    const newUrl = `https://leftoversnextjsbucket.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Update MySQL
    await connection.execute("UPDATE users SET profile_pic = ? WHERE email = ?", [newUrl, email]);
    await connection.end();

    return NextResponse.json({ success: true, url: newUrl }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
};
