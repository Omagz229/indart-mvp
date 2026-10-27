# INDART — G1-T01 Repository & Product Functionality Audit
**Snapshot:** GitHub `Omagz229/indart-mvp`, branch `main`, inspected 2026-10-27
**Base commit:** `bee6f8347778478fda8fdfbe7ba4feba1ecd768e` (G1 baseline)
**Classification:** STATIC SOURCE INSPECTION / PRELIMINARY; NOT A PASSED G1 GATE
**Programme:** Investor-ready by 2027-01-04, not public launch. Pre-investment incremental cash budget: NGN 0.

## 1. Method and verification limits
Read the GitHub recursive tree and selected source files through the connected GitHub interface. Inspected route code, membership and Stripe APIs, Clerk integration, Sanity imports, component dependencies, tests and documentation. Git clone failed in the local execution environment because the host could not resolve github.com. **No npm install, build, test run, browser render, test payment, deployment inspection, or production security testing was performed.** Findings below distinguish direct source evidence from likely runtime consequences and unverified functionality. This is not a complete source-by-source security audit. Local unpushed commits may differ from the inspected remote branch.

Repository tree observed: 67 blobs (excluding directories), 50 .ts/.tsx files, 15 page.tsx routes, 4 test files, one Sanity accessControl object schema.

## 2. Executive findings
- **P0: Incomplete commit / unresolved local imports.** Eight sampled routes/components import files absent from the inspected Git tree; the project is not demonstrably buildable. Build failure is strongly expected, **not confirmed by running a build**.
- **P0: Homepage and application shell are starter scaffolding.** `app/page.tsx` contains default Next.js introductory UI, `app/layout.tsx` uses Create Next App metadata, and README is stock boilerplate.
- **P0: Missing core content runtime modules.** `sanity/lib/fetch`, `sanity/lib/queries`, `sanity/lib/image` are absent but imported by public content pages; no verified full Sanity document schemas for journeys, thinkers, lessons, etc.
- **P0: Missing visible lesson player.** `app/journeys/[slug]/[episode]/page.tsx` imports `./view`, absent from the tree; it also imports absent `components/membership/access-gate`.
- **P0: Missing shared frontend modules.** `components/layout/page-shell`, `lib/indart-tokens`, `lib/typography` and `components/thinker/types` are absent but imported.
- **P0: Auth integration incomplete in current tree.** `app/layout.tsx` provides no ClerkProvider, and no nested layout appears in the tree. Existing client components call Clerk hooks. A working client auth flow is not established.
- **P0: Checkout return targets absent.** `app/api/checkout/route.ts` redirects to `/membership/welcome` and `/membership`, but the inspected tree has only `app/membership/welcome/view.tsx` and no `app/membership/page.tsx` or `app/membership/welcome/page.tsx`. The checkout view likewise has no `page.tsx`. These URLs lack route entrypoints in this snapshot.
- **P1: Real learner persistence not established.** `app/member/library/page.tsx` uses a hard-coded `JOURNEY_PROGRESS` array; `app/account/page.tsx` explicitly identifies `RECENT_JOURNEYS` as mock data.
- **P1: Monetization does not yet implement the approved experiments.** Existing checkout supports scholar monthly, scholar annual and a one-off founding-patron payment through Stripe. No verified daily/weekly entitlement, per-video purchase, campaign pre-sale, local-provider payment, refund liability ledger, or access grant for individually purchased content.
- **P1: Secure offline learning unverified.** No verified mobile client, DRM/offline license, protected download manager or offline entitlement reconciliation in the tree.
- **P1: Automated testing limited in coverage.** Four unit-test files were found, focused on tier helpers and metadata-source assertions; no end-to-end purchase, player, content, webhook or offline tests verified.
- **P1: Deployment and secrets state unknown.** No environment sample file, CI workflow, live deployment status or secrets configuration was verified in this audit.

## 3. Reproducible static import examples
The following imports do not resolve to any committed file in the tree at the snapshot:
| Importing file | Unresolved references |
|---|---|
| `app/journeys/[slug]/[episode]/page.tsx` | `@/sanity/lib/fetch`, `@/sanity/lib/image`, `@/components/membership/access-gate`, `./view` |
| `app/journeys/page.tsx` | `@/sanity/lib/fetch`, `@/sanity/lib/queries`, `@/sanity/lib/image` |
| `app/archive/[slug]/page.tsx` | same three `@/sanity/lib/*` modules |
| `app/themes/[slug]/page.tsx` | same three Sanity modules plus `./view` |
| `app/thinkers/[slug]/page.tsx` | same three Sanity modules plus `@/components/thinker/types` |
| `app/member/page.tsx` | `@/components/layout/page-shell`, `@/lib/indart-tokens`, `@/lib/typography` |
| `app/membership/checkout/view.tsx` | `@/lib/indart-tokens`, `@/lib/typography` |
| `components/auth/auth-gate.tsx` | `@/lib/indart-tokens`, `@/lib/typography` |

This is a targeted sample, not a complete exhaustive import census. Recover genuine omitted source files from the authoritative local worktree **before rebuilding them from scratch**.

## 4. Capability matrix
| Function | Source evidence | Audit status |
|---|---|---|
| Next.js/React/TypeScript baseline | `package.json` | Dependency declaration verified; build untested |
| Public homepage | `app/page.tsx` | Starter only |
| Visual design / UI tokens | Imports across views | Referenced but missing |
| Browsable content pages | `app/journeys`, `app/archive`, `app/disciplines`, `app/thinkers` | Routes coded; runtime blocked/unverified |
| Sanity CMS | Sanity dependencies and `sanity/schemas/objects/accessControl.ts` | Schema/queries/fetch incomplete in remote |
| Clerk auth and tier model | `lib/auth/*`, Clerk deps; `app/api/auth/*` | Partial implementation; provider and end-to-end tests needed |
| Stripe subscriptions | Checkout, portal, webhook files | Logic present; not verified in running app |
| Per-video purchase | No verified purchase/entitlement path | Missing for investor-demo scope |
| Daily/weekly access | No corresponding checkout prices or expiries | Missing for investor-demo scope |
| Offline protected video | No verified implementation | Feasibility work required |
| Learner library/progress | Mock arrays in library/account | Not genuine persistence |
| Community / marketplace / events | Strategic future pillars | Not required for Jan demo; economics/specification only |
| Ad/sponsorship placement | Strategic plan | Future design specification |
| Automated tests | 4 .test.ts files | Source verified; not executed |

## 5. Access, billing and compliance review flags (not confirmed vulnerabilities)
1. `lib/auth/tier.ts` implements tier ranks and expiry; `app/journeys/[slug]/[episode]/page.tsx` checks entitlements server-side before presenting its lesson data. These are useful partial controls.
2. `components/auth/auth-gate.tsx` is client-rendered and checks membership rank only, rather than the expiry helper. It must not be the sole boundary for sensitive content.
3. `lib/auth/__tests__/content-tier.test.ts` explicitly expects unknown CMS tiers to map to free access. Treat this as a **fail-open configuration risk** for accidentally misclassified paid content; assess fail-closed behavior.
4. Webhook reconciliation and Stripe-to-Clerk membership code exists. Its idempotency tracks the last processed event ID in user metadata, not a verified durable processed-event log; out-of-order and concurrent delivery cases require testing.
5. `app/api/auth/sync/route.ts` has a bearer-key admin reconciliation endpoint; stated rate limiting in its comment is not verified from the code tree. Review authentication, logging, throttling, privilege boundaries and deployment exposure.
6. Document-based purchase rights, prepaid passes, refunds and video access persistence will require a separate entitlement and finance record design; do not bolt them onto the current simple three-tier ranking.

## 6. Priority engineering work orders
### P0 — Recover and make buildable (target G1, 2026-11-02)
- **T01.1 Source reconciliation:** Compare authoritative local worktree/unpushed commits with GitHub main. Recover any missing legitimate source files and avoid losing unreleased work. **Acceptance:** all local imports resolve; differences and commit hashes recorded.
- **T01.2 Dependency and environment baseline:** Document Node/npm versions, safe env template (names only), application config, integration owners, secret storage, deployment requirements. **Acceptance:** reproducible clean setup guide with no secret exposure.
- **T01.3 Build and automated test run:** Run `npm ci`, `npm run lint`, `npm run test`, `npm run build` and record full results with commit hashes. **Acceptance:** all pass or every failing command has a numbered blocker. Do not report pass before execution.
- **T01.4 Homepage and routing:** Restore intended Indart homepage, membership and checkout entrypoint pages and a consistent app shell. **Acceptance:** routes render; no default Next.js starter; links and redirects resolve.
- **T01.5 Auth/provider wiring:** Verify ClerkProvider placement, signed-in/out journeys, tier propagation and server-side gates. **Acceptance:** tested login, protected content, downgrade/expiry.
- **T01.6 CMS/lesson integrity:** Restore queries, fetch helper, image transforms, complete schemas, player view and content seed. **Acceptance:** instructor → course → lesson navigation using licensed/demo-safe content.

### P1 — Artist-facing investor demo (target APR-01, 2026-11-23)
- **T01.7 Investor/demo path:** Discovery → instructor profile → course page → lesson preview → simulated checkout → learner library, with demonstration-only data clearly labelled. **Acceptance:** scriptable successful full walkthrough.
- **T01.8 Entitlement architecture:** Data model for daily/weekly/monthly/annual, single video, grants, revocations, expiry, refunds and offline access. **Acceptance:** signed off architecture and test matrix; no live billing enabled.
- **T01.9 Billing QA:** Use test modes only, validate webhooks, retry/idempotency, order of delivery, reconciliation and refund behavior. **Acceptance:** documented outcomes and no production money flows.
- **T01.10 Design QA:** Responsive layouts, accessibility, performance and consistent editorial brand. **Acceptance:** recorded cross-device checks and defects.
- **T01.11 Content security:** Validate server entitlement checks, media URL issuance, playback security, secure demo assets. **Acceptance:** unauthorized premium-content requests denied in tests.

### P2 — January investment feasibility package (by 2027-01-04)
- **T01.12 Offline-first mobile/DRM:** Compare provider licensing, availability, implementation cost and demonstrate a limited secure native offline playback experiment if feasible without new cash. **Acceptance:** genuine feasibility evidence or an explicit blocked/deferred decision.
- **T01.13 Payment localization:** Compare Nigerian payment providers, short-duration billing constraints, net settlement and access reconciliation. **Acceptance:** specification and integrated simulations.
- **T01.14 Instrumentation:** Plan real versus synthetic analytics separation, learning-progress storage, paid orders, renewals, royalties and presales. **Acceptance:** approved event definitions and measurement plan.
- **T01.15 Documentation:** System diagrams, QA ledger, operational runbooks and risks for data room. **Acceptance:** traceable evidence links.

## 7. Gate state and owners
- **G1:** OPEN / NOT PASSED. A repository inventory exists; source reconciliation, build, tests, env baseline and audit completion remain outstanding.
- **APR-01:** OPEN. Artist-facing demonstration depends on P0 route, auth and content recovery.
- **Accountability:** founder approves scope; engineering executor not independently appointed; AI can prepare review/docs/code drafts but cannot claim tests executed without access.
- **Costs:** NGN 0 incremental cash prior to investor readiness; do not turn on paid plans or production payments.
- **Next engineering action:** reconcile local unpushed code with connected GitHub main; then execute actual clean build/test in a source-accessible runtime.

## 8. Source evidence
- Repo tree: https://github.com/Omagz229/indart-mvp/tree/main
- Home: https://github.com/Omagz229/indart-mvp/blob/main/app/page.tsx
- Layout: https://github.com/Omagz229/indart-mvp/blob/main/app/layout.tsx
- Episode: https://github.com/Omagz229/indart-mvp/blob/main/app/journeys/%5Bslug%5D/%5Bepisode%5D/page.tsx
- Checkout: https://github.com/Omagz229/indart-mvp/blob/main/app/api/checkout/route.ts
- Webhooks: https://github.com/Omagz229/indart-mvp/blob/main/lib/stripe/webhooks.ts
- Test example: https://github.com/Omagz229/indart-mvp/blob/main/lib/auth/__tests__/tier.test.ts

**No product code has been modified in this report.**
