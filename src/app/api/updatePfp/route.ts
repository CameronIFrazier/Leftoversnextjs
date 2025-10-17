import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import mysql from "mysql2/promise";
import { verify } from "jsonwebtoken";

export const POST = async (req: Request) => {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return new Response(JSON.stringify({ success: false, error: "No token" }), { status: 401 });

  let email: string;
  try {
    const payload: any = verify(token, process.env.JWT_SECRET!);
    email = payload.email;
  } catch {
    return new Response(JSON.stringify({ success: false, error: "Invalid token" }), { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("pfp") as File | null;
    if (!file) return new Response(JSON.stringify({ success: false, error: "No file uploaded" }), { status: 400 });

    const arrayBuffer = await file.arrayBuffer();

    


// Inside your POST handler
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

    // Connect to DB to check old PFP
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });

    const [rows]: any = await connection.execute("SELECT profile_pic FROM users WHERE email = ?", [email]);
    const oldUrl = rows[0]?.profilePic;

    // Delete old uploaded PFP if exists
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
        // ACL: "public-read", NOT USING ACL ANYMORE
      })
    );

    const newUrl = `https://leftoversnextjsbucket.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;


    // Update DB
    await connection.execute("UPDATE users SET profile_pic = ? WHERE email = ?", [newUrl, email]);
    await connection.end();

    return new Response(JSON.stringify({ success: true, url: newUrl }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
};
