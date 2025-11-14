export async function POST() {
  // Messages API removed — respond with 410 Gone to indicate it's intentionally disabled
  return new Response(JSON.stringify({ success: false, error: 'Messages API removed' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' },
  });
}
