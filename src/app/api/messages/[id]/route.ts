export async function GET() {
  // Messages GET API intentionally disabled per request — return 410 Gone.
  return new Response(JSON.stringify({ success: false, error: 'Messages API removed' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' },
  });
}
