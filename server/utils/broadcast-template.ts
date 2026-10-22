import type { EpicFreeGame } from './epic'

const BG = '#0c0e12'
const SURFACE = '#111318'
const SURFACE_LOW = '#1a1c20'
const BORDER = 'rgba(255,255,255,0.1)'
const PRIMARY = '#00df81'
const FG = '#ffffff'
const MUTED = '#8b9099'

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function gameCard(game: EpicFreeGame): string {
  return `
<tr><td style="padding:0 0 16px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SURFACE};border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">
    <tr><td style="padding:12px 16px;border-bottom:1px solid ${BORDER};">
      <span style="font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:2px;color:${PRIMARY};font-weight:bold;">&#9679; CLAIMABLE NOW</span>
    </td></tr>
    <tr><td style="padding:0;">
      <a href="${esc(game.url)}" target="_blank" style="text-decoration:none;display:block;">
        <img src="${esc(game.imageUrl)}" alt="${esc(game.title)}" width="568" style="display:block;width:100%;height:auto;border:0;" />
      </a>
    </td></tr>
    <tr><td style="padding:16px;">
      <h2 style="margin:0 0 8px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;color:${FG};">${esc(game.title)}</h2>
      ${game.description ? `<p style="margin:0 0 14px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${MUTED};">${esc(game.description)}</p>` : ''}
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${SURFACE_LOW};border:1px solid ${BORDER};border-radius:4px;">
        <tr>
          <td style="padding:10px 12px;font-family:Menlo,Consolas,monospace;font-size:12px;color:${MUTED};">
            PRICE:&nbsp;<span style="color:${MUTED};text-decoration:line-through;">${esc(game.originalPrice)}</span>&nbsp;&nbsp;<span style="color:${PRIMARY};font-weight:bold;">FREE</span>
          </td>
          <td align="right" style="padding:10px 12px;font-family:Menlo,Consolas,monospace;font-size:11px;color:${MUTED};">
            ENDS: ${esc(formatDate(game.endDate))} UTC
          </td>
        </tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px;">
        <tr><td bgcolor="${PRIMARY}" style="border-radius:4px;">
          <a href="${esc(game.url)}" target="_blank" style="display:inline-block;padding:12px 32px;font-family:Menlo,Consolas,monospace;font-size:13px;font-weight:bold;letter-spacing:2px;color:${BG};text-decoration:none;">CLAIM</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</td></tr>`
}

export function buildBroadcastHtml(games: EpicFreeGame[]): string {
  const titleList = games.map((g) => esc(g.title)).join(' & ')
  const cards = games.map(gameCard).join('')

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${titleList} is FREE</title></head>
<body style="margin:0;padding:0;background-color:${BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${titleList} — free to claim on Epic Games. Ends soon.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding:0 0 24px 0;text-align:center;">
        <span style="font-family:Menlo,Consolas,monospace;font-size:13px;font-weight:bold;letter-spacing:4px;color:${PRIMARY};">LOOTDROP</span><br />
        <span style="font-family:Menlo,Consolas,monospace;font-size:10px;letter-spacing:2px;color:${MUTED};">[ FREE DROP ALERT // EPIC GAMES ]</span>
      </td></tr>
      <tr><td style="padding:0 0 24px 0;">
        <h1 style="margin:0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:24px;line-height:1.3;font-weight:bold;color:${FG};">${titleList} ${games.length > 1 ? 'are' : 'is'} now FREE on Epic Games</h1>
        <p style="margin:8px 0 0 0;font-family:Menlo,Consolas,monospace;font-size:12px;color:${MUTED};">Claim directly from the Epic Games app before the drop ends.</p>
      </td></tr>
      ${cards}
      <tr><td style="padding:16px 0 0 0;border-top:1px solid ${BORDER};">
        <p style="margin:0 0 8px 0;font-family:Menlo,Consolas,monospace;font-size:11px;color:${MUTED};">
          You are receiving this because you subscribed to LOOTDROP free game alerts.
        </p>
        <p style="margin:0;font-family:Menlo,Consolas,monospace;font-size:11px;color:${MUTED};">
          <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:${MUTED};text-decoration:underline;">Unsubscribe</a> &nbsp;|&nbsp; LOOTDROP Alert Hub — not affiliated with Epic Games, Inc.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}
