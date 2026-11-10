# MASTER PROMPT — EDUARC SECURITY, PERFORMANCE & SEO OPTIMIZATION

## Role
Act as a Senior Full-Stack Engineer, Application Security Specialist, Performance Engineer, and SEO Technical Auditor.

Your task is to audit, fix, optimize, and verify all the issues identified in my website security and performance scan.

**Project:** EduArc  
**Website:** https://eduarc-connect.in  
**Hosting:** Vercel  
**Database / Backend:** Supabase  
**Repository:** https://github.com/Likhithkumar143/eduarc-portfolio

## IMPORTANT DEVELOPMENT RULES

1. First inspect the complete existing project structure, framework, dependencies, routing, authentication, database integration, and deployment configuration.
2. Understand the existing architecture before modifying anything.
3. Do not rebuild the website from scratch.
4. Do not change existing UI design, branding, typography, colors, layouts, or animations unless required to resolve a verified accessibility issue.
5. Do not remove existing functionality.
6. Preserve all Supabase integrations, user accounts, admin features, database schemas, and existing data.
7. Do not introduce unnecessary dependencies.
8. Never expose API keys, service-role keys, authentication tokens, or environment variables.
9. Make actual code changes, not just recommendations.
10. Back up important configuration files before modifying them.
11. Test every major change before proceeding.
12. Do not declare an issue fixed without verifying it.

---

# PHASE 1 — HIGH-PRIORITY SECURITY FIXES

## 1. Content Security Policy (CSP)

Finding: CSP contains `unsafe-inline`, allowing inline script execution.

Severity: HIGH.

Tasks:

- Inspect the current Content Security Policy implementation.
- Identify whether CSP is configured in middleware, application headers, Vercel configuration, or hosting configuration.
- Remove `unsafe-inline` from `script-src` and `script-src-elem`.
- Implement a secure nonce-based CSP or hash-based CSP.
- Generate unique cryptographically secure nonces per request if using nonces.
- Ensure the nonce is correctly applied to legitimate scripts.
- Maintain compatibility with the existing framework and third-party integrations.
- Restrict script sources to trusted origins.
- Configure appropriate directives:
  - default-src
  - script-src
  - style-src
  - img-src
  - font-src
  - connect-src
  - object-src
  - base-uri
  - frame-ancestors
  - form-action
  - upgrade-insecure-requests

Important:
- Do not blindly remove inline styles if the framework requires them.
- Never use unsafe-eval unless a verified dependency absolutely requires it.
- Do not weaken CSP to make the scanner pass.
- Check Supabase authentication, storage, and API connections after implementing CSP.
- Ensure the CSP is compatible with the actual application architecture.

Acceptance criteria:
- No unsafe-inline in script execution directives.
- Legitimate application scripts continue working.
- No unexpected CSP violations.
- Supabase authentication and functionality remain operational.

## 2. Secure Admin Panel

Findings:
- /admin returns HTTP 200.
- /admin/ returns HTTP 200.

Severity: HIGH.

Tasks:

- Inspect all admin routes, layouts, middleware, server functions, API routes, and database operations.
- Identify the existing admin authentication mechanism.
- Implement proper server-side authentication and authorization.
- Protect both /admin and /admin/.
- Redirect unauthenticated users to the appropriate login page or return HTTP 401/403.
- Ensure only authorized administrators can access administrative functionality.
- Validate administrator roles using trusted server-side data.
- Never rely on frontend-only checks or localStorage flags for admin authorization.
- Protect admin APIs and server actions independently.
- Prevent normal authenticated users from accessing administrator operations.
- Verify session validity and authorization on every sensitive operation.
- Ensure unauthorized users cannot access admin data through direct API requests.
- Prevent accidental exposure of admin information through static files, source code, or publicly accessible endpoints.

Supabase-specific requirements:

- Review Supabase Auth implementation.
- Review Row Level Security (RLS) policies.
- Ensure administrator privileges are validated securely.
- Never expose the Supabase service-role key in frontend code.
- Restrict sensitive database operations to trusted server-side execution.
- Preserve existing legitimate admin accounts.

Acceptance criteria:
- Unauthenticated access to /admin is blocked.
- Unauthenticated access to /admin/ is blocked.
- Normal users cannot perform admin operations.
- Authorized administrators retain full existing functionality.
- Direct API access cannot bypass authorization.

Important: An HTTP 200 response alone is not proof of an authorization vulnerability. Verify whether protected data and functionality are actually exposed.

## 3. Server Information Exposure

Finding: Server header reveals Vercel.

Severity: LOW.

Tasks:

- Inspect response headers.
- Remove unnecessary server-identifying headers where technically supported.
- Review X-Powered-By and similar headers.
- Do not introduce unsupported or ineffective header overrides.
- Preserve Vercel routing, caching, and deployment functionality.

Acceptance criteria:
- Unnecessary technology-identifying headers are minimized.
- Application functionality remains unchanged.

---

# PHASE 2 — PERFORMANCE OPTIMIZATION

## 4. Network Dependency Tree

Severity: MEDIUM.

Tasks:

- Analyze the critical request chain.
- Identify unnecessary sequential dependencies.
- Reduce JavaScript and CSS dependency chains.
- Defer non-critical scripts.
- Preconnect to essential external origins when beneficial.
- Reduce unnecessary third-party requests.
- Optimize font loading.
- Remove unnecessary network requests.
- Use appropriate caching strategies.

Acceptance criteria:
- Shorter critical request chains.
- No unnecessary duplicate resource requests.
- No functionality regression.

## 5. LCP Request Discovery

Severity: MEDIUM.

Tasks:

- Identify the actual Largest Contentful Paint element.
- Determine whether it is a hero image, banner, heading, or another element.
- Ensure critical images are discoverable directly in the initial HTML where possible.
- Add appropriate preload hints for the actual LCP resource.
- Use fetchpriority="high" for the main LCP image where appropriate.
- Do not lazy-load the LCP image.
- Avoid preloading non-critical images.
- Optimize the LCP resource format and dimensions.

Acceptance criteria:
- LCP resource is discovered early.
- No unnecessary image preloads.
- Improved LCP performance.

## 6. Render-Blocking Requests

Finding: Estimated savings of 150 ms.

Severity: MEDIUM.

Tasks:

- Identify render-blocking CSS and JavaScript.
- Remove unused CSS.
- Split critical and non-critical CSS where appropriate.
- Defer non-essential scripts.
- Optimize font loading and font-display.
- Inline only genuinely critical CSS when beneficial.
- Avoid introducing excessive inline styles or scripts that undermine CSP.

Acceptance criteria:
- Reduce render-blocking resources.
- Preserve initial page appearance.
- No layout instability.

## 7. Forced Reflow

Severity: MEDIUM.

Tasks:

- Inspect JavaScript responsible for layout recalculation.
- Identify repeated DOM reads and writes.
- Avoid layout thrashing.
- Batch DOM operations.
- Optimize scroll and resize event listeners.
- Use requestAnimationFrame for appropriate visual updates.
- Avoid unnecessary synchronous layout calculations.
- Optimize animation implementations.

Acceptance criteria:
- Reduce forced synchronous layout calculations.
- Maintain existing animations and interactions.

## 8. Reduce Unused JavaScript

Finding: Estimated savings of 183 KiB.

Severity: LOW.

Tasks:

- Analyze bundle composition.
- Identify unused libraries and components.
- Implement route-based code splitting.
- Use dynamic imports for non-critical components.
- Remove genuinely unused dependencies.
- Optimize imports from large libraries.
- Lazy-load components that are not required on initial render.
- Avoid loading admin-only dependencies on public pages.
- Avoid unnecessary client-side JavaScript.

Acceptance criteria:
- Reduce initial JavaScript bundle size.
- Preserve all existing functionality.

## 9. Missing Source Maps

Severity: MEDIUM.

Tasks:

- Configure production source maps appropriately.
- Prefer private source-map uploads or deployment artifact storage.
- Do not expose sensitive source code through publicly accessible source maps.
- Verify that source maps are available for debugging through the intended private workflow.

Acceptance criteria:
- First-party JavaScript can be debugged.
- Sensitive source code is not unnecessarily exposed publicly.

---

# PHASE 3 — ACCESSIBILITY

## 10. Color Contrast

Finding: Background and foreground colors do not have sufficient contrast.

Severity: MEDIUM.

Tasks:

- Audit all pages and reusable components.
- Check text against WCAG 2.2 AA contrast requirements.
- Normal text: minimum 4.5:1.
- Large text: minimum 3:1.
- Important UI components and graphical indicators: minimum 3:1 where applicable.
- Check buttons, links, cards, labels, placeholders, disabled states, and navigation.
- Fix contrast using the smallest possible color adjustments.
- Preserve EduArc's existing branding and visual identity.

Acceptance criteria:
- All applicable text and interface elements meet contrast requirements.
- No unnecessary design changes.

## 11. Heading Hierarchy

Finding: Heading elements are not in sequentially descending order.

Severity: MEDIUM.

Tasks:

- Audit heading hierarchy across all pages.
- Ensure one meaningful H1 per page where appropriate.
- Follow a logical H1 → H2 → H3 hierarchy.
- Do not use heading tags solely for styling.
- Preserve existing font sizes and visual appearance using CSS classes.

Acceptance criteria:
- Logical semantic heading structure.
- No unnecessary visual changes.

---

# PHASE 4 — SEO OPTIMIZATION

## 12. Missing Meta Description

Severity: MEDIUM.

Tasks:

- Add unique and meaningful meta descriptions to all important public pages.
- Write descriptions relevant to each page's actual content.
- Avoid duplicate descriptions.
- Use appropriate title and description metadata.
- Ensure metadata is rendered correctly in the initial HTML.

## 13. Missing Open Graph Image

Severity: MEDIUM.

Tasks:

- Create or use an appropriate EduArc-branded social sharing image.
- Recommended dimensions: 1200 × 630 pixels.
- Add og:image.
- Add og:title.
- Add og:description.
- Add og:type.
- Add og:url.
- Add twitter:card.
- Add twitter:title.
- Add twitter:description.
- Add twitter:image.
- Ensure the image is publicly accessible and uses an absolute HTTPS URL.

## 14. Missing Canonical URL

Severity: MEDIUM.

Tasks:

- Add canonical URLs to all indexable public pages.
- Use the preferred HTTPS domain: https://eduarc-connect.in
- Avoid duplicate URLs caused by trailing slashes and query parameters.
- Do not canonicalize unrelated pages to the homepage.
- Exclude private admin and authentication pages from indexing where appropriate.

Acceptance criteria:
- Correct canonical URL on every relevant public page.
- No conflicting canonical tags.

---

# PHASE 5 — IMAGE OPTIMIZATION

## 15. Improve Image Delivery

Finding: Estimated savings of 775 KiB.

Severity: LOW.

Tasks:

- Audit all large images.
- Identify oversized and inefficient image formats.
- Convert suitable images to WebP or AVIF.
- Generate responsive image sizes.
- Implement srcset and sizes where appropriate.
- Optimize hero images and above-the-fold images.
- Lazy-load below-the-fold images.
- Do not lazy-load critical LCP images.
- Preserve image quality.
- Avoid downloading multiple unnecessary image variants.
- Review Supabase Storage image delivery and transformations if applicable.
- Preserve existing image URLs or implement safe backward-compatible changes.

Acceptance criteria:
- Reduced image transfer size.
- No broken image links.
- No visible degradation in quality.

## 16. Missing Explicit Image Dimensions

Severity: LOW.

Tasks:

- Add explicit width and height attributes to image elements.
- Ensure correct aspect ratios.
- Use aspect-ratio CSS when appropriate.
- Prevent cumulative layout shift.
- Update reusable image components.

Acceptance criteria:
- Images reserve their required layout space before loading.
- Reduced CLS.

---

# PHASE 6 — RESOURCE LOADING ERROR

## 17. HTTP 403 Failed Resource

Finding:
Console error: Failed to load resource: server responded with 403.

Severity: MEDIUM.

Tasks:

- Identify the exact failing resource using browser developer tools and network logs.
- Determine whether the failure originates from:
  - Supabase Storage.
  - Authentication.
  - CDN.
  - Vercel.
  - Third-party service.
  - Incorrect permissions.
  - Expired signed URL.
- Inspect the request URL, response headers, and relevant logs.
- Fix the actual root cause.
- Review Supabase bucket policies and RLS policies if applicable.
- Do not make private storage buckets public simply to eliminate the error.
- Ensure valid signed URLs and authentication are used where required.
- Add graceful fallback handling for genuinely unavailable resources.

Acceptance criteria:
- Previously failing legitimate resources load successfully.
- Private resources remain protected.
- No unauthorized access introduced.

---

# PHASE 7 — FINAL VERIFICATION

After completing all modifications:

1. Run the project's existing build command.
2. Run linting and type checking.
3. Resolve newly introduced errors.
4. Test all major public pages.
5. Test authentication and registration.
6. Test admin authentication and authorization.
7. Test Supabase database connectivity.
8. Test Supabase Storage image loading.
9. Verify CSP headers.
10. Verify /admin and /admin/ protection.
11. Verify metadata and canonical URLs.
12. Verify image dimensions and loading priorities.
13. Check browser console for errors.
14. Check network requests for 403 errors.
15. Run Lighthouse on mobile and desktop.
16. Verify there are no broken links or missing assets.
17. Check responsive layouts.

Do not weaken security settings to improve Lighthouse scores.

## FINAL REPORT REQUIRED

When all tasks are completed, provide a detailed report with:

| No. | Finding | Status | Files Modified |
|---|---|---|---|
| 1 | CSP unsafe-inline | Fixed / Pending | File paths |
| 2 | Admin access /admin | Fixed / Pending | File paths |
| 3 | Admin access /admin/ | Fixed / Pending | File paths |
| 4 | Network dependency tree | Fixed / Pending | File paths |
| 5 | LCP discovery | Fixed / Pending | File paths |
| 6 | Render-blocking requests | Fixed / Pending | File paths |
| 7 | Forced reflow | Fixed / Pending | File paths |
| 8 | Color contrast | Fixed / Pending | File paths |
| 9 | Heading hierarchy | Fixed / Pending | File paths |
| 10 | Meta description | Fixed / Pending | File paths |
| 11 | Open Graph image | Fixed / Pending | File paths |
| 12 | Canonical URL | Fixed / Pending | File paths |
| 13 | Source maps | Fixed / Pending | File paths |
| 14 | HTTP 403 | Fixed / Pending | File paths |
| 15 | Image delivery | Fixed / Pending | File paths |
| 16 | Image dimensions | Fixed / Pending | File paths |
| 17 | Vercel server header | Fixed / Pending | File paths |
| 18 | Unused JavaScript | Fixed / Pending | File paths |

Also report:

- Original vs optimized bundle size.
- Original vs optimized image transfer size.
- Lighthouse Performance score before and after, if available.
- Lighthouse Accessibility score before and after, if available.
- Lighthouse SEO score before and after, if available.
- Build status.
- Security verification results.
- Any remaining issues and their exact causes.

## FINAL INSTRUCTION

Work autonomously through all phases.

Do not stop after producing an audit report. Implement the fixes directly in the existing project.

If a fix requires additional configuration, explain exactly what is required and implement everything possible without inventing credentials or weakening security.

Preserve EduArc's existing design and functionality.

**The final objective is a secure, fast, accessible, SEO-optimized, production-ready EduArc website with all 18 findings addressed and verified.**