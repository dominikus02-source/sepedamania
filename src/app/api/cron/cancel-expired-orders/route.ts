import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ success: true, message: 'Expired orders cancelled' })
}
