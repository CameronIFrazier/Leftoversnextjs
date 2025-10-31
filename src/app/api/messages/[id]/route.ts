import mysql, { RowDataPacket } from 'mysql2/promise';

type MessageRow = {
  id: number;
  conversation_id: string;
  sender: string;
  body: string;
  created_at: string;
};

const MOCK: Record<string, any[]> = {
  "1": [
    { id: '1-1', from: 'Avery Park', body: 'Hey — are you free to chat about the sponsorship?', time: '10:12am' },
    { id: '1-2', from: 'You', body: 'Sure — what do you have in mind?', time: '10:15am' },
  ],
  "2": [
    { id: '2-1', from: 'Leftovers Team', body: 'Welcome to your inbox. Click anywhere on a message to reply.', time: '9:00am' },
  ],
};

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Try to fetch from MySQL if env is configured
  try {
    if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER) throw new Error('DB env not configured');

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT || 3306),
    });

    const [rows] = await connection.query<RowDataPacket[] & MessageRow[]>(
      'SELECT id, conversation_id, sender, body, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [id]
    );

    await connection.end();

    const messages = rows.map((r) => ({ id: String(r.id), from: r.sender, body: r.body, time: r.created_at }));

    return new Response(JSON.stringify({ success: true, messages }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.warn('Could not load messages from DB, falling back to mock:', err);
    const messages = MOCK[id] ?? [];
    return new Response(JSON.stringify({ success: true, messages }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
