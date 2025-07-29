# HSWLP:Next – Cloudflare alapú újgenerációs SaaS rendszer

Ez a repository a HSWLP platform `hswlp-next` nevű **új alaprendszere**, amelyre a különböző frontend rétegek (ún. **shellek**) épülnek. A rendszer teljesen Cloudflare-infrastruktúrán fut (Workers, D1, R2, KV), és készen áll SaaS alkalmazások hosztolására – külön back-end nélkül.

Ez az alap biztosítja a következőket:

- Bejelentkezés, regisztráció, email hitelesítés
- Turnstile captcha
- Cloudflare D1 adatbázis migrációkkal
- R2 tárhely és KV session kezelés
- Stripe integráció és emailküldés (Resend vagy Brevo)
- Alkalmas Cloudflare Pages és Edge funkciók kiszolgálására

---

## Használat lokálisan

1. Telepítés:

   ```bash
   pnpm install
   ```

2. Környezeti változók:

   - Másold le a `.env.example` fájlt `.env` néven, majd töltsd ki.
   - Ha használod: `.dev.vars.example` → `.dev.vars`

3. Lokális migráció és indítás:

   ```bash
   pnpm db:migrate:dev
   pnpm dev
   ```

4. Nyisd meg a böngészőben:
   [http://localhost:3000](http://localhost:3000)

---

## Cloudflare deploy

A rendszer automatikusan deployolható Cloudflare Workers-re:

```bash
pnpm run deploy
```

Ez lefuttatja az `opennext:build` és `opennextjs-cloudflare deploy` parancsokat, majd feltölti:

- a Worker kódot
- statikus asseteket (R2)
- titkos környezeti változókat (`wrangler secret put`)
- valamint a `wrangler.json` alapján hozzárendeli:
  - D1 adatbázist
  - KV namespace-eket
  - R2 bucketet

A `.env` fájl NEM kerül automatikusan feltöltésre – a titkos adatokat külön kell beállítani `wrangler secret put` paranccsal vagy a Cloudflare dashboardon.

---

## Fontos konfigurációs helyek

- Állandók: `src/constants.ts`
- Email sablonok: `src/react-email/`
- Globális CSS: `src/app/globals.css`
- Meta adatok: `src/app/layout.tsx`
- Wrangler config: `wrangler.json`

---

## Email sablonok előnézete

```bash
pnpm email:dev
```

→ [http://localhost:3001](http://localhost:3001)

---

## A rendszer jövője

A `hswlp-next` az alapja minden jövőbeli HSWLP shellnek, ideértve:

- `HSWLP:Cloud` (statikus site deploy)
- `HSWLP:NAS` (helyi Docker stack manager)
- `HSWLP:Dev` (fejlesztői központ)
- `HSWLP:Store` (sablon piactér)
- `HSWLP:Academy` (oktatási modul)

Egy közös rendszer, több célra.
Tisztán, Cloudflare-alapon.

---
