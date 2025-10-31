export async function POST() {
  // This API was removed by request — keep a benign response to avoid runtime errors.
  return new Response(JSON.stringify({ success: false, error: 'Upload API removed' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' },
  });
}