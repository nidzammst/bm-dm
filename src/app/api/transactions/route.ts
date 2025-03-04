export async function GET() {
  try {
    return Response.json({ status: 200, message: "success" });
  } catch (error) {
    return new Response(`Error fetching data: ${error}`, {
      status: 500,
    });
  }
}
