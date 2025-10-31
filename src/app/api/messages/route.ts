import mysql from 'mysql2/promise';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received message POST', body);

    // Try to persist to DB if configured
    try {
      if (process.env.MYSQL_HOST && process.env.MYSQL_USER) {
        const connection = await mysql.createConnection({
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          port: Number(process.env.MYSQL_PORT || 3306),
        });

        const { conversationId, message } = body;
        const sender = message?.from ?? 'unknown';
        const msgBody = message?.body ?? message;

        await connection.query(
          'INSERT INTO messages (conversation_id, sender, body, created_at) VALUES (?, ?, ?, NOW())',
          [conversationId, sender, msgBody]
        );

        await connection.end();
      }
    } catch (dbErr) {
      console.warn('Failed to persist message to DB:', dbErr);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Error in /api/messages', err);
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
