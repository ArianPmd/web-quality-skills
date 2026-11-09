export async function proxyApi(request: Request): Promise<Response> {
  const res = await fetch('https://api.example.com' + new URL(request.url).pathname);
  const out = new Headers(res.headers);
  // fetch() already decompressed the body.
  out.delete('content-encoding');
  out.delete('content-length');
  return new Response(res.body, { status: res.status, headers: out });
}

export async function getJson(url: string) {
  const res = await fetch(url);
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}
