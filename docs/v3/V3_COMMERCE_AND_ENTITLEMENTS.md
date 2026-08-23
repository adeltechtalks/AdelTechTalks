# V3_COMMERCE_AND_ENTITLEMENTS

**Status:** proposal. **Hardened in v3.1** — §1, §3 and the new §9. Ships in Phase 3. Written now because the entitlement resolver is used from the foundation release onward and needs a stable shape.

---

## 1 · The one rule

**Access is granted by a verified Stripe webhook writing an entitlement row. It is never granted by a client redirect.**

A visitor returning to `/courses/x/?session_id=...` proves nothing: the URL can be typed. Every "unlock on success page" implementation is a paywall with a hole in it, and it is the single most common way small course sites leak paid content.

The success page therefore says *"Thanks — setting up your access"* and polls `GET /api/entitlements/status`, which resolves from the `entitlements` table. Access appears when the webhook has been received, verified and processed. Usually that is under two seconds; when it is not, the page says so honestly rather than guessing.

**No endpoint anywhere reads `session_id` from a redirect and grants anything on the strength of it** — not as a fast path, not as a fallback, not behind a flag. The success page may *display* a Stripe session id it was given; it may not *act* on one.

---

## 2 · Why Stripe, and why Checkout

Stripe Checkout and the Customer Portal, not a custom payment form.

- Card data never touches AdelTechTalks. PCI scope collapses to "we redirect to Stripe".
- Checkout handles 3-D Secure, wallets, tax collection, receipts and localisation — all things that are weeks of work and a source of quiet bugs.
- The Customer Portal handles refunds, invoices, payment-method updates and cancellation without a single self-service billing screen being built.

The trade is less control over the checkout visual. That is the right trade for a one-person product.

---

## 3 · The identity bridge

```
Supabase user_id  ←→  stripe_customer_id
```

Held in `stripe_customers`, one row per user, created lazily on first checkout.

**`/api/checkout` accepts a `product_key` and nothing else about money.** No
amount, no currency, no `price_id`, no coupon value, no quantity above 1. The
`stripe_price_id` is resolved server-side from the product's front matter. A
client-supplied price is a discount the customer wrote themselves — and a request
carrying one is rejected 400, not silently ignored.

```
1. Signed-in user clicks Buy
2. POST /api/checkout           { product_key }        ← and nothing else
3. Server verifies the session (never trusts a client-supplied user_id)
4. Look up or create the Stripe customer; persist the mapping
5. Create a Checkout Session with:
       customer         = stripe_customer_id
       client_reference_id = user_id          ← the bridge, echoed back on the webhook
       metadata         = { user_id, product_key, kind }
6. Return the session URL; the browser redirects
```

Both `client_reference_id` and `metadata.user_id` are set. If either is missing on a webhook the event is parked with an error rather than guessed at — an entitlement granted to the wrong account is worse than one granted late.

**Purchase requires an account.** Guest checkout would create an orphan payment with no one to grant access to, and reconciling it by email invites account-takeover-by-typo. The buy button on a signed-out session routes through `/join/` and returns.

---

## 4 · The webhook

`POST /api/stripe/webhook` — `prerender = false`, the only unauthenticated write endpoint on the site.

```
1. Read the raw body. Verify the Stripe-Signature header against
   STRIPE_WEBHOOK_SECRET using the constructed-event API.
   Signature invalid → 400, nothing else happens.
2. INSERT into stripe_events (id = Stripe's event id).
   Primary-key conflict → 200 and stop. This is the idempotency gate:
   Stripe retries, and retries must be harmless.
3. Handle the event inside a transaction.
4. Stamp processed_at. On failure, record `error` and return 500 so Stripe retries.
```

| event | effect |
|---|---|
| `checkout.session.completed` | mark the purchase paid; grant the entitlement; enrol if a course; register if a workshop |
| `payment_intent.payment_failed` | mark the purchase failed; grant nothing |
| `charge.refunded` | mark refunded; **revoke** the entitlement (`revoked_at`) |
| `customer.subscription.created/updated` | upsert the subscription; grant or revoke the class entitlement |
| `customer.subscription.deleted` | revoke at period end |
| `invoice.payment_failed` | flag; grace period; revoke only after Stripe gives up |

Every handler is idempotent on its own, independent of the ledger — belt and braces.

Local development uses the Stripe CLI to forward events; **there is no "trust me" bypass flag**, because a bypass flag is a production backdoor waiting for a bad merge.

---

## 5 · The entitlement resolver

One table (`entitlements`), one server-side function, and no component anywhere asks about purchases directly.

```ts
// server-only
hasEntitlement(userId, subjectType, subjectId): Promise<boolean>
entitlementsFor(userId): Promise<Entitlement[]>
grantEntitlement(userId, subject, source, ref, expiresAt?): Promise<void>
revokeEntitlement(userId, subject, source): Promise<void>
```

Resolution order — first match wins:

```
1. content is free            → true, no query
2. '*' class entitlement      → e.g. subject_type='course', subject_id='*'
3. exact subject entitlement
4. otherwise                  → false
```

A row counts only if `revoked_at is null` and (`expires_at is null` or in the future).

Six sources write here — `free`, `membership`, `purchase`, `subscription`, `workshop`, `grant` — and `unique (user_id, subject_type, subject_id, source)` means a person can hold the same access twice through different routes without ambiguity. Revoking a refunded purchase does not revoke access they also have through a subscription, which is exactly right and is very hard to get right with a boolean column on a course row.

`grant` exists for admin comps, support recovery, and giving early readers a course. It is written by a server-side script, never by a UI.

---

## 6 · Protected downloads

Free resources are public files on the CDN. **Entitled resources are never public URLs**, because a public URL is public forever and gets pasted into Discord.

```
Private Supabase Storage bucket. No public read policy.

GET /api/download/[resourceSlug]
  1. verify the session server-side
  2. hasEntitlement(userId, 'resource', slug)   ← fails closed
  3. create a signed URL, TTL 60 seconds, single resource
  4. 302 to it, and log the issuance
```

Sixty seconds is enough to start a download and short enough that a leaked link is worthless. The signed URL is never rendered into HTML — the page links to `/api/download/...`, and the redirect happens on click.

---

## 7 · Products at launch

| product | kind | price | entitlement written |
|---|---|---|---|
| Build Your Brand Identity with AI | course | one-time | `course:build-your-brand-identity-with-ai` |
| Launch a Website with AI | course | one-time | `course:launch-a-website-with-ai` |
| Vibe Coding to a Real Product | course | one-time | `course:vibe-coding-to-a-real-product` |
| Build an AI Workflow for Your Business | course | one-time | `course:build-an-ai-workflow-for-your-business` |
| Live workshop | workshop | one-time | `workshop:<slug>` + recording |
| (future) Membership | subscription | recurring | `course:*`, `resource:*` |

Prices live in **Stripe**, not in the repo. The content front matter carries a `stripe_price_id`, never an amount — a price in two places is a price that will disagree, and the one in git will be the one a customer screenshots.

Currency is USD at launch. Stripe handles presentment; no multi-currency logic is written.

---

## 8 · What is deliberately not built

- **No custom cart.** One product per checkout. A cart for four courses is a week of work for a case that will not happen.
- **No coupon UI.** Stripe promotion codes, entered in Checkout.
- **No invoice rendering.** Customer Portal.
- **No tax logic.** Stripe Tax if and when it is needed.
- **No refund UI.** Refunds happen in the Stripe dashboard; the webhook revokes access automatically.

Each of these is a deliberate absence, recorded so it is not mistaken for an oversight.

---

## 9 · Secret handling — stated explicitly *(v3.1)*

Not because it is novel, but because "we all know that" is exactly how a secret
reaches a client bundle.

| secret | where it lives | reachable from the browser |
|---|---|---|
| `STRIPE_SECRET_KEY` | Cloudflare **secret binding** | never |
| `STRIPE_WEBHOOK_SECRET` | Cloudflare **secret binding** | never |
| `STRIPE_PUBLISHABLE_KEY` | public config | yes, by design |

- **Not `vars` in `wrangler.jsonc`.** `vars` are plaintext in the config file and
  in the deployment. Secrets are bindings.
- **Never `PUBLIC_`-prefixed**, and never read in a module reachable from a client
  island. The `src/server/` import boundary is a build check, not a convention.
- **The Stripe client is constructed in exactly one file**, which exports
  functions rather than the client.
- **The CI check greps built client output for secret *value* patterns** —
  `sk_live`, `sk_test`, `whsec_`, and the service-role JWT shape. It does not grep
  for binding *names*, which legitimately appear in `_worker.js`; a check that
  fails on the name teaches people to rename the binding.
- **No bypass flag exists in the webhook handler.** Local development forwards
  real signed events with the Stripe CLI. A "skip signature verification in dev"
  flag is a production backdoor waiting for a bad merge, and there is not one to
  find.
