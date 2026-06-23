import { toNextJsHandler } from 'better-auth/next-js'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, ctx: any) {
  try {
    const { auth } = await import('@/lib/auth')
    const { GET: handler } = toNextJsHandler(auth.handler)
    return handler(req, ctx)
  } catch (error) {
    console.error('[v0] Auth GET error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

export async function POST(req: Request, ctx: any) {
  try {
    const { auth } = await import('@/lib/auth')
    const { POST: handler } = toNextJsHandler(auth.handler)
    return handler(req, ctx)
  } catch (error) {
    console.error('[v0] Auth POST error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
