# LOOTDROP — Free Epic Games Mobile Drop Alerts

Landing page notifikasi email untuk game **gratis Epic Games di mobile (Android & iOS)**.
Pengunjung memasukkan email, sistem menyimpannya ke segmen [Resend](https://resend.com),
lalu setiap hari otomatis memeriksa game free-to-claim di Epic Games Store mobile
dan mengirim broadcast email berisi link klaim resmi.

Proyek ini dibangun dengan **Nuxt 4** (Nitro server) dan dideploy di **Netlify**.

> Bukan afiliasi resmi Epic Games, Inc. — hanya agregator notifikasi dengan link resmi ke store.epicgames.com.

## Cara Kerja

```mermaid
flowchart TD
    A[Pengunjung membuka landing page] --> B[Submit email via form]
    B --> C[POST /api/resend/create-contact]
    C --> D[Email disimpan ke segmen Resend]
    E[Netlify Scheduled Function @daily] --> F[POST /api/resend/create-broadcast]
    F --> G{Ambil game free-to-claim dari API Epic Games mobile}
    G -->|Ada game baru| H[Kirim broadcast email via Resend]
    G -->|Tidak ada / sudah terkirim| I[Skip]
    H --> D
```

1. **Landing page** (`app/`) — halaman `app.vue` merender komponen `LdPage`
   yang terdiri dari `LdHeader`, `LdHero` (form subscribe), `LdTelemetry`
   (kartu demo), dan `LdFooter`.
2. **Subscribe** — form di `LdHero` memvalidasi email dengan Zod
   lalu memanggil `POST /api/resend/create-contact`, yang membuat kontak
   baru di Resend pada segmen yang dikonfigurasi.
3. **Broadcast harian** — Netlify Scheduled Function
   (`netlify/functions/scheduled-create-broadcast.mts`, cron `@daily`)
   memanggil `POST /api/resend/create-broadcast` dengan Bearer token.
4. **Deteksi game gratis** — endpoint broadcast memanggil
   `fetchEpicFreeGames()` di `server/utils/epic.ts`, yang membaca
   `https://egs-platform-service.store.epicgames.com/api/v2/public/discover/home`
   dengan parameter `platform=android`, lalu memfilter offer bertipe `Claim`
   berharga 0 dan belum berakhir.
5. **Kirim email** — email HTML dibangun oleh `buildBroadcastHtml()`
   (`server/utils/broadcast-template.ts`) dan dikirim sebagai broadcast
   Resend `send: true`. Idempoten: nama broadcast
   `free-games:<slug1>+<slug2>` dipakai untuk mencegah kirim ganda.

## Struktur Direktori

```
.
├── app/
│   ├── app.vue                    # Entry, merender <LdPage />
│   ├── assets/css/tailwind.css    # Global styles + utility kustom
│   └── components/
│       ├── LdHeader.vue           # Navbar sticky dengan logo & CTA
│       ├── LdHero.vue             # Hero + form subscribe email
│       ├── LdTelemetry.vue        # Kartu "radar" (contoh data statis)
│       ├── LdPage.vue             # Layout wrapper
│       ├── LdFooter.vue           # Footer
│       └── ui/                    # Komponen shadcn (badge, button, card, input)
├── server/
│   ├── api/resend/
│   │   ├── create-contact.post.ts   # Simpan email subscriber
│   │   └── create-broadcast.post.ts # Kirim broadcast game gratis (Bearer-token)
│   ├── plugins/dns-ipv4first.ts     # Paksa resolusi DNS IPv4 dulu
│   └── utils/
│       ├── epic.ts                  # fetchEpicFreeGames + withRetry
│       ├── broadcast-template.ts    # Template HTML email
│       └── resend.ts                # Instance client Resend
├── netlify/functions/
│   └── scheduled-create-broadcast.mts  # Scheduler harian (@daily)
├── public/                          # favicon, robots.txt
└── nuxt.config.ts                   # Runtime config & module shadcn-nuxt
```

## Setup

### 1. Install dependencies

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### 2. Environment variables

Buat file `.env` (lihat `.gitignore` — file ini tidak ikut ter-commit):

```bash
RESEND_API_KEY="re_xxxxxxxx"       # API key dari dashboard Resend
RESEND_SEGMENT_ID="xxxx"           # ID segmen audience untuk subscriber
RESEND_FROM="LOOTDROP <onboarding@resend.dev>"  # Alamat pengirim
BROADCAST_TOKEN="random-string"    # Token untuk mengamankan endpoint broadcast
```

Untuk scheduled function di Netlify, pastikan `SITE_URL` (atau `URL` /
`DEPLOY_PRIME_URL`) menunjuk ke URL deploy produksi, misalnya
`https://lootdrop.netlify.app`.

Catatan: `RESEND_FROM` harus dari domain yang sudah diverifikasi di Resend
guna menghindari email masuk spam. Alamat `onboarding@resend.dev` hanya bisa
dikirim ke akun Resend milik Anda sendiri (untuk testing).

## Menjalankan Aplikasi

### Development server

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

Buka `http://localhost:3000`.

### Build untuk produksi

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### Preview build produksi

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Dokumentasi lebih lanjut: [Deployment Nuxt](https://nuxt.com/docs/getting-started/deployment).

## API Endpoints

| Method | Path                              | Auth                | Deskripsi |
| ------ | --------------------------------- | ------------------- | --------- |
| `POST` | `/api/resend/create-contact`      | —                   | Menambahkan email subscriber ke segmen Resend. Body: `{ email: string }` |
| `POST` | `/api/resend/create-broadcast`    | `Bearer <BROADCAST_TOKEN>` | Mengambil game gratis dari Epic, lalu mengirim broadcast email. Body opsional `{ testTo?: string }` untuk kirim test. |

Contoh kirim test broadcast (misal setelah deploy):

```bash
curl -X POST https://<site-url>/api/resend/create-broadcast \
  -H "Authorization: Bearer $BROADCAST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"testTo":"you@example.com"}'
```

Jika tidak ada game gratis aktif atau broadcast dengan nama yang sama
sudah pernah dikirim, endpoint akan merespons `{ skipped: true, reason: ... }`
tanpa mengirim email.

## Scheduled Broadcast

`netlify/functions/scheduled-create-broadcast.mts` menggunakan
[Netlify Scheduled Functions](https://docs.netlify.com/functions/scheduled-functions/)
dengan konfigurasi `schedule: '@daily'`. Setiap hari function ini:

1. Membaca payload event (berisi `next_run`) untuk logging.
2. Memastikan `SITE_URL` dan `BROADCAST_TOKEN` tersedia.
3. Melakukan `POST` ke `${SITE_URL}/api/resend/create-broadcast`
   dengan Bearer token.
4. Mengembalikan `200` bila berhasil, `502` bila panggilan endpoint gagal.

Karena endpoint broadcast dilindungi token, pastikan nilai `BROADCAST_TOKEN`
di environment Netlify sama persis dengan nilai di environment Nuxt/Netlify
Site.

## Teknologi

- [Nuxt 4](https://nuxt.com/docs) — framework Vue 3 full-stack (Nitro server)
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [shadcn-nuxt](https://www.shadcn-nuxt.com) + [Reka UI](https://reka-ui.com) — komponen UI
- [vee-validate](https://vee-validate.logaretm.com) + [Zod](https://zod.dev) — validasi form
- [Resend](https://resend.com) — pengiriman email & broadcast
- [Netlify Functions](https://docs.netlify.com/functions/) — scheduled job harian
- [@phosphor-icons/vue](https://phosphoricons.com) — ikon

## Lisensi

Proyek pribadi. Nama "LOOTDROP" dan aset visual adalah bagian dari proyek ini
dan tidak berafiliasi dengan Epic Games, Inc.
