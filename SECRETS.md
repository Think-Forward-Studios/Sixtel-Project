# Secrets & rotation runbook

This documents **where each secret lives** and **how/when to rotate it**. It
contains *no secret values* — only locations and procedures. Keep it current as
new integrations are added.

> Cardinal rules: secrets never go in Git (only `.env.local`, which is
> git-ignored, holds local values); `NEXT_PUBLIC_*` vars are browser-exposed, so
> a secret must never be given that prefix; the Supabase **secret** key and DB
> passwords are root-equivalent — treat accordingly.

## When to rotate (applies to all)
- **Annually**, as routine hygiene.
- **Immediately** on any suspected compromise (leaked key, lost laptop, etc.).
- **Immediately** when an admin/staff member with access leaves.

## Inventory

| Secret | Where it lives | How to rotate |
|---|---|---|
| **Supabase staging DB password** | Password manager (`sixtel-staging-db-password`); macOS Keychain (CLI cache); inside the `STAGING_DB_DIRECT_URL` GitHub Actions secret | Dashboard → staging → Settings → Database → reset password. Then update the password manager, re-run `supabase link` (refreshes Keychain), and update the `STAGING_DB_DIRECT_URL` Actions secret. |
| **Supabase prod DB password** | Password manager (`sixtel-prod-db-password`) | Dashboard → prod → Settings → Database → reset password; update password manager and any prod consumers (Netlify, prod backup secret) once they exist. |
| **Supabase API keys** (publishable + secret, per project) | Local: `.env.local`. Staging/prod: Netlify env (later) + password manager | Dashboard → Project Settings → API Keys → roll the key; update `.env.local` and Netlify env. Publishable is browser-safe; **secret** is server-only. |
| **Supabase CLI access token** | macOS Keychain (from `supabase login`) | Supabase account → Access Tokens → revoke + create new; run `supabase login` again. |
| **GitHub Actions secrets** (`STAGING_DB_DIRECT_URL`, `B2_KEY_ID`, `B2_APP_KEY`) | GitHub repo → Settings → Secrets and variables → Actions | Regenerate at the source (DB password / Backblaze key), then update the corresponding Actions secret. |
| **Backblaze application key** (keyID + applicationKey) | GitHub Actions secrets (`B2_KEY_ID`, `B2_APP_KEY`); password manager | Backblaze → Application Keys → create a new key scoped to bucket `Sixtel-backups`; update both Actions secrets; delete the old key. |
| **`APP_ENCRYPTION_KEY`** | `.env.local` (local); Netlify env (later) | Generate with `openssl rand -base64 32`. ⚠️ Once it encrypts real at-rest data, rotation requires re-encrypting that data with the new key — plan a migration, don't just swap it. |
| **Square** (`SQUARE_ACCESS_TOKEN`, `SQUARE_WEBHOOK_SIGNATURE_KEY`) | Not yet set — placeholders in `.env.local`; Netlify env later | Square developer dashboard → regenerate; update `.env.local` + Netlify. |
| **Twilio** (`TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`) | Not yet set — placeholders in `.env.local`; Netlify env later | Twilio console → rotate auth token; update `.env.local` + Netlify. |

## Practice exercise
Rotate the **local-only** `APP_ENCRYPTION_KEY` once now (regenerate with
`openssl rand -base64 32`, paste into `.env.local`) — there's no real encrypted
data yet, so it's a safe way to rehearse the motion before it counts.
