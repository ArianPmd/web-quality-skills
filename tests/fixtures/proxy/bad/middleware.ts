export async function proxyApi(request: Request): Promise<Response> {
  const res = await fetch('https://api.example.com' + new URL(request.url).pathname);
  const out = new Headers(res.headers);
  return new Response(res.body, { status: res.status, headers: out });
}

export async function getJson(url: string) {
  const res = await fetch(url);
  return res.json().catch(() => null);
}
