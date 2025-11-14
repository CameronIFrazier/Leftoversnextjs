import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),
  connectionLimit: 10,
});

type JWTPayload = { userName?: string; username?: string; sub?: string };

function getSenderFromAuth(req: Request): string | null {
  const auth =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;

  const token = auth.slice("Bearer ".length).trim();

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = secret
      ? (jwt.verify(token, secret) as JWTPayload)
      : (jwt.decode(token) as JWTPayload);

    return (decoded?.userName || decoded?.username || decoded?.sub) ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const postId = Number(body?.postId);
    const toUsername = String(body?.toUsername ?? "").trim();
    const note = (body?.note ?? "").trim();

    const post = body?.post as
      | {
          id: number;
          title?: string;
          description?: string;
          username?: string;
          avatar?: string | null;
          media_url?: string | null;
          created_at?: string | null;
        }
      | undefined;

    const fromToken = getSenderFromAuth(req);
    const fromUsername: string | null =
      (typeof body?.fromUsername === "string"
        ? body.fromUsername.trim()
        : "") || fromToken;

    if (!postId || !toUsername) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing postId or toUsername" }),
        { status: 400 }
      );
    }

    if (!fromUsername) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Missing sender (JWT or fromUsername)",
        }),
        { status: 401 }
      );
    }

    // Optional sanity check that post exists
    const [rows] = await pool.execute(
      "SELECT id FROM posts WHERE id = ? LIMIT 1",
      [postId]
    );
    // @ts-ignore
    if (!rows?.length) {
      return new Response(
        JSON.stringify({ ok: false, error: "Post not found" }),
        { status: 404 }
      );
    }

    // JSON payload that will live in messages.message
    const payload = JSON.stringify({
      type: "shared_post",
      note: note || undefined,
      post: {
        id: postId,
        title: post?.title ?? "",
        description: post?.description ?? "",
        username: post?.username ?? null,
        avatar: post?.avatar ?? null,
        media_url: post?.media_url ?? null,
        created_at: post?.created_at ?? null,
      },
    });

    const [ins] = await pool.execute(
      `INSERT INTO messages (sender, receiver, message, created_at)
       VALUES (?, ?, ?, NOW())`,
      [fromUsername, toUsername, payload]
    );
    // @ts-ignore
    const messageId = Number(ins.insertId);

    return new Response(JSON.stringify({ ok: true, messageId }), {
      status: 200,
    });
  } catch (err) {
    console.error("[/api/sharePost] error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: "Server error" }),
      { status: 500 }
    );
  }
}
